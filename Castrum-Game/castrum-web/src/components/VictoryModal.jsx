import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const VictoryModal = ({ isOpen, winnerName, message, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAction = () => {
        onClose(); // Modalı kapat
        navigate('/leaderboard'); // <--- KRİTİK: Seni Liderlik Tablosuna götürür!
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in px-4">
            <div className="bg-[#15100d] border-4 border-[#ffd700] p-8 md:p-12 rounded-2xl shadow-[0_0_100px_rgba(255,215,0,0.3)] text-center max-w-lg w-full relative overflow-hidden transform hover:scale-105 transition-transform duration-500">
                
                {/* Işık Efekti */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ffd700]/10 to-transparent pointer-events-none"></div>

                <div className="mb-6 flex justify-center">
                    <Trophy size={80} className="text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-bounce" />
                </div>
                
                <h2 className="text-5xl text-[#ffd700] font-bold mb-4 drop-shadow-md" style={{ fontFamily: "'Great Vibes', cursive" }}>
                    Zafer!
                </h2>
                
                <h3 className="text-2xl text-[#d7ccc8] font-bold mb-2 uppercase tracking-widest">
                    {winnerName}
                </h3>
                
                <p className="text-[#a68b6a] mb-8 font-cinzel text-sm md:text-base">
                    {message}
                </p>

                <button 
                    onClick={handleAction}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-black font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg rounded-xl"
                >
                    Liderlik Tablosunu Gör
                </button>
            </div>
        </div>
    );
};

export default VictoryModal;