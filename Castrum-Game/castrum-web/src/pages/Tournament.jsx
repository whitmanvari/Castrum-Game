import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { User, Swords } from 'lucide-react';

const Tournament = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [opponentName, setOpponentName] = useState("");
    const [loading, setLoading] = useState(false);

    // Sayfa açılınca giriş yapmış kullanıcıyı al
    useEffect(() => {
        const storedUser = localStorage.getItem("castrum_user");
        if (!storedUser) {
            navigate("/"); // Giriş yapmamışsa at
            return;
        }
        setCurrentUser(JSON.parse(storedUser));
    }, [navigate]);

    const startMatch = async () => {
        if (!opponentName) {
            alert("Lütfen bir rakip general ismi giriniz!");
            return;
        }

        setLoading(true);
        try {
            // P1: Giriş Yapan (Savunan/Beyaz)
            // P2: Rakip (Saldıran/Siyah)
            // İstersen burada yer değiştirebilirsin.
            const p1 = currentUser.username;
            const p2 = opponentName.toUpperCase();

            const data = await gameService.createGame(p2, p1); // Attacker(P2), Defender(P1)
            navigate(`/game/${data.id}`, { state: { p1, p2 } });
        } catch (error) {
            console.error(error);
            alert("Oyun başlatılamadı.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto animate-fade-in p-4">
            
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl text-[#ffd700] font-black drop-shadow-md mb-2 tracking-wide font-cinzel">
                    KOMUTA MERKEZİ
                </h2>
                <p className="text-gray-400 text-xs md:text-sm tracking-[0.3em] uppercase">
                    Hoşgeldin General <span className="text-white font-bold">{currentUser.username}</span>
                </p>
            </div>

            <div className="bg-[#15100d] border border-[#3e2723] p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                {/* Dekoratif Çizgiler */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-50"></div>

                <div className="space-y-8">
                    {/* BEN (Otomatik Dolu) */}
                    <div>
                        <label className="flex items-center gap-2 text-[#ffd700] text-xs font-bold tracking-widest mb-3 uppercase">
                            <User size={16} /> Senin Birliğin (Savunan)
                        </label>
                        <div className="w-full bg-[#0c0a09]/50 border border-[#3e2723] p-4 text-[#d7ccc8] font-bold rounded-lg flex items-center gap-3 opacity-80 cursor-not-allowed">
                            <span className="text-2xl">🛡️</span>
                            {currentUser.username}
                        </div>
                    </div>

                    <div className="flex items-center justify-center opacity-50">
                        <Swords size={32} className="text-[#8b7355]" />
                    </div>

                    {/* RAKİP (Elle Girilecek) */}
                    <div>
                        <label className="flex items-center gap-2 text-red-500 text-xs font-bold tracking-widest mb-3 uppercase">
                            <User size={16} /> Rakip General (Saldıran)
                        </label>
                        <input
                            type="text"
                            placeholder="RAKİP İSMİ GİRİNİZ..."
                            className="w-full bg-[#0c0a09] border border-[#3e2723] p-4 text-[#d7ccc8] font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all uppercase tracking-wider rounded-lg"
                            value={opponentName}
                            onChange={(e) => setOpponentName(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={startMatch}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#ffd700] to-[#b8860b] hover:from-[#d4af37] hover:to-[#a0522d] text-black font-black tracking-[0.2em] text-lg shadow-[0_0_20px_rgba(255,215,0,0.2)] transform hover:scale-[1.02] active:scale-95 transition-all rounded-xl flex items-center justify-center gap-3"
                    >
                        {loading ? "CEPHE OLUŞTURULUYOR..." : "SAVAŞI BAŞLAT"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tournament;