import React from 'react';

const Lobby = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full max-w-md">
       <div className="text-center mb-8">
            <h2 className="text-4xl text-[#ffd700] font-bold drop-shadow-md mb-2">SAVAŞA KATIL</h2>
            <p className="text-[#a68b6a] text-sm tracking-widest">Ordunu seç ve tarih yaz.</p>
       </div>

       <div className="w-full bg-[#15100d] p-8 border border-[#3e2723] shadow-2xl relative">
            {/* Dekoratif Köşebentler */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#ffd700]"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#ffd700]"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#ffd700]"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#ffd700]"></div>

            <div className="space-y-6">
                <div>
                    <label className="text-[#8b7355] text-xs font-bold uppercase tracking-widest mb-1 block">Oda İsmi / ID</label>
                    <input type="text" className="w-full bg-[#0c0a09] border border-[#3e2723] p-3 text-[#d7ccc8] focus:border-[#ffd700] focus:outline-none transition-colors" placeholder="#8291..." />
                </div>
                
                <button className="w-full bg-gradient-to-r from-[#b8860b] to-[#8b4513] hover:from-[#d4af37] hover:to-[#a0522d] text-black font-bold py-4 px-8 shadow-lg transform active:scale-95 transition-all">
                    HEMEN KATIL
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-[#3e2723] flex-1"></div>
                    <span className="text-xs text-[#5d4037]">VEYA</span>
                    <div className="h-[1px] bg-[#3e2723] flex-1"></div>
                </div>

                <button className="w-full bg-transparent border border-[#5d4037] text-[#8b7355] hover:text-[#ffd700] hover:border-[#ffd700] py-3 px-8 font-bold transition-all">
                    YENİ ODA OLUŞTUR
                </button>
            </div>
       </div>
    </div>
  );
};

export default Lobby;