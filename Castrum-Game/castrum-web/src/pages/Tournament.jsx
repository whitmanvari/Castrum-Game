import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tournament = () => {
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  const startMatch = () => {
    if(p1 && p2) {
      // İsimleri alıp Savaş Alanına yönlendiriyoruz
      // Gerçekte burada backend'e "Maç Oluştur" isteği atacağız
      navigate('/', { state: { p1, p2 } }); 
    } else {
      alert("Lütfen iki gladyatörün de ismini giriniz!");
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full max-w-2xl">
       <div className="text-center mb-10">
            <h2 className="text-5xl text-[#ffd700] font-bold drop-shadow-md mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Büyük Turnuva
            </h2>
            <p className="text-[#a68b6a] text-sm tracking-[0.3em] uppercase">Marmara BÖTE - Zeka Oyunları Dersi</p>
       </div>

       {/* VS KARTI */}
       <div className="w-full bg-[#15100d] p-10 border border-[#3e2723] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row items-center gap-8">
            
            {/* SAVUNAN (Sol Taraf) */}
            <div className="flex-1 w-full space-y-2 text-center group">
                <div className="text-[#d7ccc8] text-xs font-bold tracking-widest mb-2 group-focus-within:text-[#ffd700]">SAVUNAN (BEYAZ)</div>
                <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-stone-200 rounded-full border-4 border-[#5d4037] flex items-center justify-center text-3xl shadow-inner mb-4">
                        🛡️
                    </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Öğrenci Adı..." 
                  className="w-full bg-[#0c0a09] border border-[#3e2723] p-3 text-center text-[#d7ccc8] font-bold focus:border-[#ffd700] focus:outline-none transition-colors uppercase tracking-wider"
                  onChange={(e) => setP1(e.target.value)}
                />
            </div>

            {/* VS Sembolü */}
            <div className="text-5xl font-black text-[#3e2723] drop-shadow-lg italic">VS</div>

            {/* SALDIRAN (Sağ Taraf) */}
            <div className="flex-1 w-full space-y-2 text-center group">
                <div className="text-[#d7ccc8] text-xs font-bold tracking-widest mb-2 group-focus-within:text-red-500">SALDIRAN (SİYAH)</div>
                <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-stone-900 rounded-full border-4 border-[#5d4037] flex items-center justify-center text-3xl shadow-inner mb-4">
                        ⚔️
                    </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Öğrenci Adı..." 
                  className="w-full bg-[#0c0a09] border border-[#3e2723] p-3 text-center text-[#d7ccc8] font-bold focus:border-red-900 focus:outline-none transition-colors uppercase tracking-wider"
                  onChange={(e) => setP2(e.target.value)}
                />
            </div>
       </div>

       {/* Başlat Butonu */}
       <button 
         onClick={startMatch}
         className="mt-10 px-12 py-4 bg-gradient-to-r from-[#b8860b] to-[#8b4513] hover:from-[#d4af37] hover:to-[#a0522d] text-black font-black tracking-widest text-lg shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:scale-105 transition-transform"
       >
         MAÇI BAŞLAT
       </button>
    </div>
  );
};

export default Tournament;