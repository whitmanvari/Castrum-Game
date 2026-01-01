import React, { useState } from 'react';
import { PIECES, isValidMove, processMove, checkWin, checkKingCaptured } from '../utils/gameLogic';
import { gameService } from '../services/gameService';

// --- GÖRSEL VARLIKLAR ---
const celticPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H22v-2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2z' fill='%232c1e16' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`;

const CastleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5 text-[#2a1a10] drop-shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]">
        <path d="M19 3H5v2h14V3zm0 4H5v2h14V7zm0 4H5v2h14v-2zm-7 4H5v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2zM5 19h14v2H5v-2z"/>
    </svg>
);

const GameBoard = ({ gameId, board, onBoardUpdate, onWin, isReplayMode, p1Name, p2Name }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [turn, setTurn] = useState(PIECES.DEFENDER); // Sıra takibi
    
    // Etiketler
    const colLabels = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
    const rowLabels = [13,12,11,10,9,8,7,6,5,4,3,2,1]; 

    const handleCellClick = async (row, col) => {
        // İzleme modunda tıklama yasak
        if (isReplayMode) return;

        const clickedPiece = board[row][col];

        // 1. SEÇİM
        if (!selectedCell) {
            if (clickedPiece !== PIECES.EMPTY) {
                // Sıra kontrolü
                const isDefenderTurn = turn === PIECES.DEFENDER;
                const isPieceDefender = clickedPiece === PIECES.DEFENDER || clickedPiece === PIECES.KING;
                if ((isDefenderTurn && isPieceDefender) || (!isDefenderTurn && !isPieceDefender)) {
                    setSelectedCell({ r: row, c: col });
                }
            }
            return;
        }

        // 2. SEÇİMİ KALDIR
        if (selectedCell.r === row && selectedCell.c === col) {
            setSelectedCell(null);
            return;
        }

        // 3. HAMLE YAP
        if (isValidMove(board, selectedCell.r, selectedCell.c, row, col)) {
            try {
                // Tahtanın kopyasını al
                const tempBoard = board.map(r => [...r]);
                const movingPiece = tempBoard[selectedCell.r][selectedCell.c];
                
                // Hareketi uygula
                tempBoard[row][col] = movingPiece;
                tempBoard[selectedCell.r][selectedCell.c] = PIECES.EMPTY;

                // Taş yeme kuralını uygula
                const currentPlayer = movingPiece === PIECES.ATTACKER ? PIECES.ATTACKER : PIECES.DEFENDER;
                const { board: finalBoard, captured } = processMove(tempBoard, row, col, currentPlayer);

                // --- KAZANMA KONTROLLERİ ---
                // Savunan Kazandı mı?
                if (movingPiece === PIECES.KING && checkWin(finalBoard)) {
                    onWin(p1Name, "Kral Sığınağa Ulaştı!"); // Modal Tetikle
                }
                
                // Saldıran Kazandı mı?
                if (checkKingCaptured(finalBoard)) {
                     onWin(p2Name, "Kral Esir Alındı!"); // Modal Tetikle
                }

                // Backend'e kaydet 
                if (gameId) {
                    await gameService.makeMove(gameId, selectedCell.r, selectedCell.c, row, col);
                }

                const logText = `${colLabels[selectedCell.c]}${13-selectedCell.r} ➞ ${colLabels[col]}${13-row} ${captured ? '⚔️' : ''}`;
                const side = turn === PIECES.ATTACKER ? 'enemy' : 'friendly';
                
                onBoardUpdate(finalBoard, logText, side); 

                // Sırayı değiştir ve seçimi temizle
                setTurn(turn === PIECES.DEFENDER ? PIECES.ATTACKER : PIECES.DEFENDER);
                setSelectedCell(null);

            } catch (error) {
                console.error("Hamle Hatası:", error);
            }
        } else {
            // Geçersiz hamle, eğer başka taşa tıkladıysa seçimi ona kaydır
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
        const baseClasses = "w-[85%] h-[85%] rounded-full shadow-2xl relative flex items-center justify-center transition-transform hover:scale-105 cursor-pointer z-10";
        switch (pieceType) {
            case PIECES.ATTACKER: return <div className={`${baseClasses} bg-gradient-to-b from-[#2d3748] to-[#000000] border border-gray-600 shadow-black`} />;
            case PIECES.DEFENDER: return <div className={`${baseClasses} bg-gradient-to-b from-[#fff5e6] to-[#d4c5a9] border border-[#a68b6a] shadow-[#3e2723]/40`} />;
            case PIECES.KING: return <div className={`${baseClasses} bg-gradient-to-br from-[#c5a05a] to-[#8a6e3a] border-2 border-[#5c4033]`}><CastleIcon /></div>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-2 select-none">
            
            {/* Üst Harf Koordinatları (A, B, C...) */}
            <div className="flex pl-8 mb-1 w-full max-w-[650px] justify-between px-2">
                {colLabels.map((label, i) => (
                    <div key={i} className="flex-1 text-center text-[#8b7355] font-bold text-xs md:text-sm font-readable">{label}</div>
                ))}
            </div>

            <div className="flex items-center">
                {/* Sol Sayı Koordinatları (13, 12, 11...) */}
                <div className="grid grid-rows-13 gap-1 h-full max-h-[650px] py-3 md:py-5 pr-2">
                     {rowLabels.map((label, i) => (
                        <div key={i} className="flex items-center justify-center text-[#8b7355] font-bold text-xs md:text-sm font-readable h-full">
                            {label}
                        </div>
                    ))}
                </div>

                {/* Tahta Çerçevesi */}
                <div className="w-[85vw] h-[85vw] max-w-[650px] max-h-[650px] p-3 md:p-5 rounded bg-[#2e1d15] border-[6px] border-[#1a1008] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                    {/* Vidalar */}
                    <div className="absolute top-1 left-1 text-[#8b7355] opacity-50 text-xl">⊕</div>
                    <div className="absolute top-1 right-1 text-[#8b7355] opacity-50 text-xl">⊕</div>
                    <div className="absolute bottom-1 left-1 text-[#8b7355] opacity-50 text-xl">⊕</div>
                    <div className="absolute bottom-1 right-1 text-[#8b7355] opacity-50 text-xl">⊕</div>

                    {/* Izgara */}
                    <div 
                        className="w-full h-full grid bg-[#8d6e63] border-2 border-[#3e2723] shadow-inner"
                        style={{ 
                            gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
                            gridTemplateRows: 'repeat(13, minmax(0, 1fr))',
                            gap: '1px' // Bu gap ile sayıların gap'i eşleşti
                        }}
                    >
                        {board.map((row, rowIndex) => (
                            row.map((cellValue, colIndex) => {
                                const isCorner = (rowIndex === 0 || rowIndex === 12) && (colIndex === 0 || colIndex === 12);
                                const isCenter = rowIndex === 6 && colIndex === 6;
                                let cellClass = "bg-[#cbb694]";
                                if ((rowIndex + colIndex) % 2 === 1) cellClass = "bg-[#d7ccc8]";
                                if (isCorner || isCenter) cellClass = "bg-[#8d6e63] shadow-inner";

                                const isSelected = selectedCell?.r === rowIndex && selectedCell?.c === colIndex;
                                if (isSelected) cellClass += " ring-4 ring-[#ffd700] ring-opacity-70 z-20 shadow-[0_0_15px_#ffd700]";

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        style={{ backgroundImage: celticPattern }}
                                        className={`relative flex items-center justify-center ${cellClass} ${!isReplayMode && 'hover:brightness-110'} transition-all`}
                                    >
                                        <div className="absolute inset-0 shadow-[inset_0_0_5px_rgba(62,39,35,0.2)] pointer-events-none"></div>
                                        {(isCorner || isCenter) && <span className="absolute text-[#3e2723]/30 font-serif text-[10px] md:text-xl select-none">ᛝ</span>}
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