import React from 'react';

const VictoryModal = ({ isOpen, winnerName, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#15100d] border-4 border-[#ffd700] p-10 rounded-lg shadow-[0_0_100px_rgba(255,215,0,0.4)] text-center max-w-lg relative overflow-hidden transform scale-110">
                
                {/* Işık Efekti */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ffd700]/10 to-transparent pointer-events-none"></div>

                <div className="mb-6 text-6xl">🏆</div>
                
                <h2 className="text-5xl text-[#ffd700] font-bold mb-4 drop-shadow-md" style={{ fontFamily: "'Great Vibes', cursive" }}>
                    Zafer!
                </h2>
                
                <h3 className="text-2xl text-[#d7ccc8] font-bold mb-2 uppercase tracking-widest">
                    {winnerName}
                </h3>
                
                <p className="text-[#a68b6a] mb-8 font-cinzel">
                    {message}
                </p>

                <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-[#ffd700] text-black font-bold uppercase tracking-widest hover:bg-[#fffacd] transition-colors shadow-lg"
                >
                    Savaş Alanına Dön
                </button>
            </div>
        </div>
    );
};

export default VictoryModal;