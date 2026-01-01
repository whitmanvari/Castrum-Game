import React, { useState } from 'react';
import { PIECES, isValidMove, processMove, checkWin, checkKingCaptured } from '../utils/gameLogic';
import { gameService } from '../services/gameService';

// --- GÖRSEL VARLIKLAR ---
const celticPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H22v-2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2z' fill='%232c1e16' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`;

const CastleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5 text-[#2a1a10] drop-shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]">
        <path d="M19 3H5v2h14V3zm0 4H5v2h14V7zm0 4H5v2h14V7zm0 4H5v2h14v-2zm-7 4H5v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2zM5 19h14v2H5v-2z"/>
    </svg>
);

const GameBoard = ({ gameId, board, onBoardUpdate, onWin, isReplayMode, p1Name, p2Name }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [turn, setTurn] = useState(PIECES.DEFENDER);
    
    const colLabels = ['A','B','C','D','E','F','G','H','I','J','K'];
    const rowLabels = [11,10,9,8,7,6,5,4,3,2,1]; 

    const handleCellClick = async (row, col) => {
        if (isReplayMode) return;
        const clickedPiece = board[row][col];

        if (!selectedCell) {
            if (clickedPiece !== PIECES.EMPTY) {
                const isDefenderTurn = turn === PIECES.DEFENDER;
                const isPieceDefender = clickedPiece === PIECES.DEFENDER || clickedPiece === PIECES.KING;
                if ((isDefenderTurn && isPieceDefender) || (!isDefenderTurn && !isPieceDefender)) {
                    setSelectedCell({ r: row, c: col });
                }
            }
            return;
        }

        if (selectedCell.r === row && selectedCell.c === col) {
            setSelectedCell(null);
            return;
        }

        if (isValidMove(board, selectedCell.r, selectedCell.c, row, col)) {
            try {
                const tempBoard = board.map(r => [...r]);
                const movingPiece = tempBoard[selectedCell.r][selectedCell.c];
                tempBoard[row][col] = movingPiece;
                tempBoard[selectedCell.r][selectedCell.c] = PIECES.EMPTY;

                const currentPlayer = movingPiece === PIECES.ATTACKER ? PIECES.ATTACKER : PIECES.DEFENDER;
                const { board: finalBoard, captured } = processMove(tempBoard, row, col, currentPlayer);

                let gameEnded = false;
                let winnerSide = 0;
                
                if (movingPiece === PIECES.KING && checkWin(finalBoard)) {
                    onWin(p1Name, "Kral Sığınağa Ulaştı!");
                    winnerSide = 2; 
                    gameEnded = true;
                } else if (checkKingCaptured(finalBoard)) {
                     onWin(p2Name, "Kral Esir Alındı!");
                     winnerSide = 1; 
                     gameEnded = true;
                }

                if (gameId) {
                    await gameService.makeMove(gameId, selectedCell.r, selectedCell.c, row, col);
                    if (gameEnded) await gameService.endGame(gameId, winnerSide);
                }

                const logText = `${colLabels[selectedCell.c]}${11-selectedCell.r} ➞ ${colLabels[col]}${11-row} ${captured ? '⚔️' : ''}`;
                const side = turn === PIECES.ATTACKER ? 'enemy' : 'friendly';
                
                onBoardUpdate(finalBoard, logText, side); 
                setTurn(turn === PIECES.DEFENDER ? PIECES.ATTACKER : PIECES.DEFENDER);
                setSelectedCell(null);
            } catch (error) { console.error(error); }
        } else {
             if (clickedPiece !== PIECES.EMPTY) {
                 const isDefenderTurn = turn === PIECES.DEFENDER;
                 const isPieceDefender = clickedPiece === PIECES.DEFENDER || clickedPiece === PIECES.KING;
                 if ((isDefenderTurn && isPieceDefender) || (!isDefenderTurn && !isPieceDefender)) {
                     setSelectedCell({ r: row, c: col });
                 }
             } else {
                 setSelectedCell(null);
             }
        }
    };

    const getPieceContent = (pieceType) => {
        const baseClasses = "w-[85%] h-[85%] rounded-full shadow-2xl relative flex items-center justify-center transition-transform cursor-pointer z-10";
        switch (pieceType) {
            case PIECES.ATTACKER: return <div className={`${baseClasses} bg-gradient-to-b from-[#2d3748] to-[#000000] border border-gray-600 shadow-black`} />;
            case PIECES.DEFENDER: return <div className={`${baseClasses} bg-gradient-to-b from-[#fff5e6] to-[#d4c5a9] border border-[#a68b6a] shadow-[#3e2723]/40`} />;
            case PIECES.KING: return <div className={`${baseClasses} bg-gradient-to-br from-[#c5a05a] to-[#8a6e3a] border-2 border-[#5c4033]`}><CastleIcon /></div>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full select-none">
            
            {/* === GRID SHELL TEKNİĞİ (Responsive Çözüm) === 
                Ekranın %95'ini kapsayan ana bir kutu oluşturuyoruz.
                Bu kutuyu Grid'e bölüyoruz:
                - Sol Sütun: Sayılar için dar alan (auto)
                - Sağ Sütun: Tahta için kalan alan (1fr)
            */}
            <div className="
                w-[95vw] md:w-[600px] 
                grid 
                grid-cols-[20px_1fr] md:grid-cols-[30px_1fr] 
                grid-rows-[20px_1fr] md:grid-rows-[30px_1fr]
                gap-1
            ">
                
                {/* 1. SOL ÜST KÖŞE (BOŞ) */}
                <div></div>

                {/* 2. ÜST HARFLER (A-K) */}
                <div className="grid grid-cols-11 w-full text-center items-end">
                    {colLabels.map((label, i) => (
                        <div key={i} className="text-[#8b7355] font-bold text-[8px] md:text-sm font-readable">
                            {label}
                        </div>
                    ))}
                </div>

                {/* 3. SOL SAYILAR (11-1) */}
                {/* Board yüksekliği ile birebir eşleşmesi için grid-rows-11 kullanıyoruz */}
                <div className="grid grid-rows-11 h-full items-center justify-center pt-[3px] pb-[3px] md:pt-[6px] md:pb-[6px]"> 
                {/* Paddingler, sağdaki tahtanın border kalınlığını dengelemek için */}
                     {rowLabels.map((label, i) => (
                        <div key={i} className="text-[#8b7355] font-bold text-[8px] md:text-sm font-readable flex items-center justify-center h-full">
                            {label}
                        </div>
                    ))}
                </div>

                {/* 4. OYUN TAHTASI */}
                <div className="
                    w-full aspect-square 
                    p-[3px] md:p-[6px] 
                    rounded bg-[#2e1d15] 
                    border-[3px] md:border-[6px] border-[#1a1008] 
                    shadow-[0_0_20px_rgba(0,0,0,0.8)] 
                    relative box-border
                ">
                    
                    {/* Vidalar (Sadece mobilde görünmesin diyorsan hidden yapabilirsin) */}
                    <div className="hidden md:block absolute top-0 left-0 text-[#8b7355] opacity-50 text-xs md:text-xl z-20">⊕</div>
                    <div className="hidden md:block absolute top-0 right-0 text-[#8b7355] opacity-50 text-xs md:text-xl z-20">⊕</div>
                    <div className="hidden md:block absolute bottom-0 left-0 text-[#8b7355] opacity-50 text-xs md:text-xl z-20">⊕</div>
                    <div className="hidden md:block absolute bottom-0 right-0 text-[#8b7355] opacity-50 text-xs md:text-xl z-20">⊕</div>

                    {/* 11x11 IZGARA */}
                    <div 
                        className="w-full h-full grid bg-[#8d6e63] border md:border-2 border-[#3e2723] shadow-inner"
                        style={{ 
                            gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
                            gridTemplateRows: 'repeat(11, minmax(0, 1fr))',
                            gap: '1px' 
                        }}
                    >
                        {board.map((row, rowIndex) => (
                            row.map((cellValue, colIndex) => {
                                const isCorner = (rowIndex === 0 || rowIndex === 10) && (colIndex === 0 || colIndex === 10);
                                const isCenter = rowIndex === 5 && colIndex === 5;
                                
                                let cellClass = "bg-[#cbb694]";
                                if ((rowIndex + colIndex) % 2 === 1) cellClass = "bg-[#d7ccc8]";
                                if (isCorner || isCenter) cellClass = "bg-[#8d6e63] shadow-inner";

                                const isSelected = selectedCell?.r === rowIndex && selectedCell?.c === colIndex;
                                if (isSelected) cellClass += " ring-2 md:ring-4 ring-[#ffd700] ring-opacity-70 z-20 shadow-[0_0_15px_#ffd700]";

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        style={{ backgroundImage: celticPattern }}
                                        className={`relative flex items-center justify-center ${cellClass} ${!isReplayMode && 'active:brightness-125 md:hover:brightness-110'} transition-all`}
                                    >
                                        <div className="absolute inset-0 shadow-[inset_0_0_5px_rgba(62,39,35,0.2)] pointer-events-none"></div>
                                        
                                        {(isCorner || isCenter) && (
                                            <span className="absolute text-[#3e2723]/30 font-serif text-[8px] md:text-xl select-none pointer-events-none">
                                                ᛝ
                                            </span>
                                        )}
                                        
                                        {getPieceContent(cellValue)}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;