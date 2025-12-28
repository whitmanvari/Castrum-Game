import React, { useState, useEffect } from 'react';
import { initializeBoard, PIECES } from '../utils/gameLogic';

// İşlemeli zemin deseni (Daha belirgin)
const celticPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H22v-2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2H22v2h-2v2z' fill='%232c1e16' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`;

// Kale Simgesi (Kral İçin)
const CastleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5 text-[#2a1a10] drop-shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]">
        <path d="M19 3H5v2h14V3zm0 4H5v2h14V7zm0 4H5v2h14v-2zm-7 4H5v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2zM5 19h14v2H5v-2z"/>
    </svg>
);

const GameBoard = () => {
    const [board, setBoard] = useState([]);

    useEffect(() => {
        setBoard(initializeBoard());
    }, []);

    const getPieceContent = (pieceType) => {
        const baseClasses = "w-[85%] h-[85%] rounded-full shadow-2xl relative flex items-center justify-center transition-transform hover:scale-105 cursor-pointer z-10";
        switch (pieceType) {
            case PIECES.ATTACKER: 
                return <div className={`${baseClasses} bg-gradient-to-b from-[#2d3748] to-[#000000] border border-gray-600 shadow-black`} />;
            case PIECES.DEFENDER:
                return <div className={`${baseClasses} bg-gradient-to-b from-[#fff5e6] to-[#d4c5a9] border border-[#a68b6a] shadow-[#3e2723]/40`} />;
            case PIECES.KING:
                return (
                    <div className={`${baseClasses} bg-gradient-to-br from-[#c5a05a] to-[#8a6e3a] border-2 border-[#5c4033]`}>
                        <CastleIcon />
                    </div>
                );
            default: return null;
        }
    };

    return (
        // Tahtayı ekranın %85 yüksekliğine (h-[85vh]) sabitliyoruz ki DEVASA görünsün
        <div className="h-[80vh] aspect-square relative z-10 flex items-center justify-center p-4">
            
            {/* Dış Çerçeve (Kalın, Oyma Ahşap) */}
            <div className="w-full h-full p-6 rounded bg-[#2e1d15] border-[8px] border-[#1a1008] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                
                {/* Dekoratif Vidalar */}
                <div className="absolute top-2 left-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>
                <div className="absolute top-2 right-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>
                <div className="absolute bottom-2 left-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>
                <div className="absolute bottom-2 right-2 text-[#8b7355] opacity-50 text-2xl">⊕</div>

                {/* Izgara Alanı */}
                <div 
                    className="w-full h-full grid bg-[#8d6e63] border-2 border-[#3e2723] shadow-inner"
                    style={{ 
                        gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
                        gridTemplateRows: 'repeat(13, minmax(0, 1fr))', // Satırları da zorla
                        gap: '1px'
                    }}
                >
                    {board.map((row, rowIndex) => (
                        row.map((cellValue, colIndex) => {
                            const isCorner = (rowIndex === 0 || rowIndex === 12) && (colIndex === 0 || colIndex === 12);
                            const isCenter = rowIndex === 6 && colIndex === 6;
                            
                            // Zemin Rengi (İşlemeli)
                            let cellClass = "bg-[#cbb694]"; // Açık parşömen
                            if ((rowIndex + colIndex) % 2 === 1) cellClass = "bg-[#d7ccc8]"; // Satranç gibi hafif ton farkı (isteğe bağlı)
                            if (isCorner || isCenter) cellClass = "bg-[#8d6e63] shadow-inner"; // Özel kareler

                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    style={{ backgroundImage: celticPattern }}
                                    className={`relative flex items-center justify-center ${cellClass} hover:brightness-110`}
                                >
                                    {/* Kare içi gölgelendirme (İşleme hissi) */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_5px_rgba(62,39,35,0.2)]"></div>
                                    
                                    {/* Köşe Simgeleri */}
                                    {(isCorner || isCenter) && (
                                        <span className="absolute text-[#3e2723]/30 font-serif text-xl md:text-3xl select-none">ᛝ</span>
                                    )}

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