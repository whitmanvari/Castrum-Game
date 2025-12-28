import React from 'react';

const Rules = () => {
  return (
    <div className="max-w-4xl w-full bg-[#15100d] border border-[#3e2723] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Dekoratif Köşe */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#ffd700]/10 to-transparent"></div>
      
      <h2 className="text-4xl text-[#ffd700] mb-8 font-bold tracking-widest border-b border-[#3e2723] pb-4" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Kadim Savaş Kuralları
      </h2>

      <div className="space-y-6 text-[#d7ccc8] font-cinzel leading-relaxed text-sm md:text-base">
        <p>
          <strong className="text-[#ffd700]">1. AMAÇ:</strong> Savaş iki taraf arasında geçer. <span className="text-red-400">Saldıranlar (Siyah)</span> Kralı esir almaya çalışırken, <span className="text-blue-300">Savunanlar (Beyaz)</span> Kralı köşelerdeki güvenli kalelere (Sığınaklara) ulaştırmaya çalışır.
        </p>

        <p>
          <strong className="text-[#ffd700]">2. HAREKET:</strong> Tüm taşlar (Kral dahil) satrançtaki kale gibi yatay ve dikey olarak istenildiği kadar ilerleyebilir. Ancak taşların üzerinden atlayamazlar.
        </p>

        <p>
          <strong className="text-[#ffd700]">3. ESİR ALMA:</strong> Bir taş, iki düşman taşı arasında (yatay veya dikey) sıkıştırılırsa oyundan çıkarılır.
        </p>

        <p>
          <strong className="text-[#ffd700]">4. KRALIN ZAFERİ:</strong> Kral, tahtanın 4 köşesinden birine ulaşmayı başarırsa Savunanlar kazanır.
        </p>
        
        <p>
          <strong className="text-[#ffd700]">5. KRALIN YENİLGİSİ:</strong> Kral, 4 tarafından da kuşatılırsa (veya 3 tarafı ve tahtanın kenarı/tahtı ile) esir alınır ve Saldıranlar kazanır.
        </p>
      </div>

      <div className="mt-8 text-center opacity-50 text-xs tracking-[0.3em] text-[#8b7355]">
        CASTRUM - STRATEGIC WARFARE
      </div>
    </div>
  );
};

export default Rules;