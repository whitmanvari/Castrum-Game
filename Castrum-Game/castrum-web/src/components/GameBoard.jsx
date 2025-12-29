import React, { useState, useEffect } from 'react';
import { PIECES, isValidMove, initializeBoard, processMove, checkWin } from '../utils/gameLogic';
import { gameService } from '../services/gameService';

// --- GÖRSEL VARLIKLAR (SVG DESENLER & İKONLAR) ---

// Zemin için Kelt Düğümü Deseni
const celticPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H22v-2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2z' fill='%232c1e16' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`;

// Kral için Kale İkonu
const CastleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5 text-[#2a1a10] drop-shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]">
        <path d="M19 3H5v2h14V3zm0 4H5v2h14V7zm0 4H5v2h14v-2zm-7 4H5v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2zM5 19h14v2H5v-2z"/>
    </svg>
);

const GameBoard = ({ gameId, onMove }) => {
    // --- STATE TANIMLARI ---
    const [board, setBoard] = useState([]); // Tahta Durumu
    const [selectedCell, setSelectedCell] = useState(null); // Seçili Taş {r, c}
    const [turn, setTurn] = useState(PIECES.DEFENDER); // Sıra Kimde? (İlk Savunan başlar)
    const [loading, setLoading] = useState(true); // Yükleniyor mu?

    // 1. BAŞLANGIÇ: OYUN VERİSİNİ ÇEK
    useEffect(() => {
        const fetchGame = async () => {
            try {
                if (gameId) {
                    // Backend'den oyun durumunu çekmeye çalış
                    const gameData = await gameService.getGame(gameId);
                    console.log("Sunucudan gelen oyun:", gameData);
                    
                    // NOT: Eğer backend henüz tahta matrisini (dizi içinde dizi) dönmüyorsa
                    // şimdilik istemci tarafında başlatıyoruz. Backend hazır olunca burayı:
                    // setBoard(gameData.board); yapmalısın.
                    setBoard(initializeBoard());
                } else {
                    // ID yoksa test amaçlı başlat
                    setBoard(initializeBoard());
                }
            } catch (error) {
                console.error("Veri çekilemedi, manuel başlatılıyor...", error);
                setBoard(initializeBoard());
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [gameId]);

    // 2. OYUN ETKİLEŞİMİ (TIKLAMA)
    const handleCellClick = async (row, col) => {
        if (loading) return;

        const clickedPiece = board[row][col];

        // A) SEÇİM YAPMA (Henüz taş seçilmediyse)
        if (!selectedCell) {
            if (clickedPiece !== PIECES.EMPTY) {
                // SIRA KONTROLÜ: Sadece sırası gelen oyuncu taş seçebilir
                const isDefenderTurn = turn === PIECES.DEFENDER;
                const isPieceDefender = clickedPiece === PIECES.DEFENDER || clickedPiece === PIECES.KING;

                if (isDefenderTurn && !isPieceDefender) return; // Sıra Beyazda ama siyaha tıkladı
                if (!isDefenderTurn && isPieceDefender) return; // Sıra Siyahta ama beyaza tıkladı

                setSelectedCell({ r: row, c: col });
            }
            return;
        }

        // B) SEÇİMİ İPTAL ETME (Kendi üstüne tıklarsa)
        if (selectedCell.r === row && selectedCell.c === col) {
            setSelectedCell(null);
            return;
        }

        // C) HAMLE YAPMA (Boş bir yere tıkladıysa)
        // Öncelikle kurallara uygun mu kontrol et
        if (isValidMove(board, selectedCell.r, selectedCell.c, row, col)) {
            try {
                // --- İYİMSER GÜNCELLEME (Optimistic UI) ---
                // Backend cevabını beklemeden ekranı güncelle (akıcılık için)
                
                // 1. Tahtanın kopyasını al
                const tempBoard = board.map(r => [...r]);
                const movingPiece = tempBoard[selectedCell.r][selectedCell.c];

                // 2. Taşı taşı
                tempBoard[row][col] = movingPiece;
                tempBoard[selectedCell.r][selectedCell.c] = PIECES.EMPTY;

                // 3. Taş Yeme (Capture) ve Oyun Sonu Kontrolü
                const currentPlayer = movingPiece === PIECES.ATTACKER ? PIECES.ATTACKER : PIECES.DEFENDER;
                const { board: finalBoard, captured } = processMove(tempBoard, row, col, currentPlayer);

                // 4. Kazanma Kontrolü (Kral Kaçtı mı?)
                if (movingPiece === PIECES.KING && checkWin(finalBoard)) {
                    alert("KRAL KAÇTI! SAVUNANLAR KAZANDI! 🏆");
                    // Burada backend'e 'oyun bitti' isteği atılabilir
                }

                // 5. Backend'e Bildir (Arka Planda)
                if (gameId) {
                    await gameService.makeMove(gameId, selectedCell.r, selectedCell.c, row, col);
                }

                // 6. State'i Güncelle
                setBoard(finalBoard);
                
                // 7. Log Oluştur (App.jsx'e gönder)
                const colLabels = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
                const logText = `${colLabels[selectedCell.c]}${13-selectedCell.r} ➞ ${colLabels[col]}${13-row} ${captured ? '⚔️' : ''}`;
                const side = turn === PIECES.ATTACKER ? 'enemy' : 'friendly';
                if (onMove) onMove(logText, side);

                // 8. Sırayı Değiştir ve Seçimi Kaldır
                setTurn(turn === PIECES.DEFENDER ? PIECES.ATTACKER : PIECES.DEFENDER);
                setSelectedCell(null);

            } catch (error) {
                console.error(error);
                alert("Hamle yapılamadı! (Sunucu Hatası)");
                // Hata olursa tahtayı eski haline getirmek gerekebilir
            }
        } else {
            // Geçersiz hamle yapıldı
            // Eğer oyuncu kendi tarafındaki başka bir taşa tıkladıysa seçimi değiştir
            if (clickedPiece !== PIECES.EMPTY) {
                const isDefenderTurn = turn === PIECES.DEFENDER;
                const isPieceDefender = clickedPiece === PIECES.DEFENDER || clickedPiece === PIECES.KING;
                
                if ((isDefenderTurn && isPieceDefender) || (!isDefenderTurn && !isPieceDefender)) {
                    setSelectedCell({ r: row, c: col });
                }
            } else {
                // Boş ve geçersiz bir yere tıkladı, seçimi kaldır
                setSelectedCell(null);
            }
        }
    };

    // 3. TAŞ GÖRÜNÜMLERİ
    const getPieceContent = (pieceType) => {
        const baseClasses = "w-[85%] h-[85%] rounded-full shadow-2xl relative flex items-center justify-center transition-transform hover:scale-105 cursor-pointer z-10";
        switch (pieceType) {
            case PIECES.ATTACKER: // Siyah
                return <div className={`${baseClasses} bg-gradient-to-b from-[#2d3748] to-[#000000] border border-gray-600 shadow-black`} />;
            case PIECES.DEFENDER: // Beyaz
                return <div className={`${baseClasses} bg-gradient-to-b from-[#fff5e6] to-[#d4c5a9] border border-[#a68b6a] shadow-[#3e2723]/40`} />;
            case PIECES.KING: // Kral
                return (
                    <div className={`${baseClasses} bg-gradient-to-br from-[#c5a05a] to-[#8a6e3a] border-2 border-[#5c4033]`}>
                        <CastleIcon />
                    </div>
                );
            default: return null;
        }
    };

    if (loading) return <div className="text-[#ffd700] text-xl animate-pulse font-bold tracking-widest">Savaş Alanı Hazırlanıyor...</div>;

    // 4. RENDER (Görsel Çıktı)
    return (
        <div className="h-[80vh] aspect-square relative z-10 flex items-center justify-center p-4">
            
            {/* Dış Çerçeve (Ahşap) */}
            <div className="w-full h-full p-6 rounded bg-[#2e1d15] border-[8px] border-[#1a1008] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                
                {/* Dekoratif Vidalar */}
                <div className="absolute top-2 left-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>
                <div className="absolute top-2 right-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>
                <div className="absolute bottom-2 left-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>
                <div className="absolute bottom-2 right-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>

                {/* Oyun Izgarası */}
                <div 
                    className="w-full h-full grid bg-[#8d6e63] border-2 border-[#3e2723] shadow-inner"
                    style={{ 
                        gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
                        gridTemplateRows: 'repeat(13, minmax(0, 1fr))',
                        gap: '1px'
                    }}
                >
                    {board.map((row, rowIndex) => (
                        row.map((cellValue, colIndex) => {
                            // Kare Tipi Belirleme (Köşe, Merkez, Standart)
                            const isCorner = (rowIndex === 0 || rowIndex === 12) && (colIndex === 0 || colIndex === 12);
                            const isCenter = rowIndex === 6 && colIndex === 6;
                            
                            // Zemin Rengi ve Deseni
                            let cellClass = "bg-[#cbb694]"; // Açık parşömen
                            if ((rowIndex + colIndex) % 2 === 1) cellClass = "bg-[#d7ccc8]"; // Satranç vari
                            if (isCorner || isCenter) cellClass = "bg-[#8d6e63] shadow-inner"; // Özel kareler

                            // Seçili Kare Efekti
                            const isSelected = selectedCell?.r === rowIndex && selectedCell?.c === colIndex;
                            if (isSelected) cellClass += " ring-4 ring-[#ffd700] ring-opacity-70 z-20 shadow-[0_0_15px_#ffd700]";

                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    style={{ backgroundImage: celticPattern }}
                                    className={`relative flex items-center justify-center ${cellClass} hover:brightness-110 transition-all`}
                                >
                                    {/* İç Gölge (Derinlik Hissi) */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_5px_rgba(62,39,35,0.2)] pointer-events-none"></div>
                                    
                                    {/* Köşe İşaretleri (Rünler) */}
                                    {(isCorner || isCenter) && (
                                        <span className="absolute text-[#3e2723]/30 font-serif text-xl md:text-3xl select-none">ᛝ</span>
                                    )}

                                    {/* Taşı Çiz */}
                                    {getPieceContent(cellValue)}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;