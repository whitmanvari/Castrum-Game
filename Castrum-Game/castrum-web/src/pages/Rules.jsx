import React from 'react';

// Küçük Taktik Tahtası Bileşeni (Görsel Anlatım İçin)
const MiniBoard = ({ type }) => {
    // Örnek senaryoları çizmek için basit grid
    // type: 'capture' (Kıstırma) veya 'escape' (Kaçış)
    return (
        <div className="w-32 h-32 bg-[#cbb694] grid grid-cols-3 grid-rows-3 gap-[1px] border-4 border-[#3e2723] shadow-lg">
            {/* Ortadaki Kareye Duruma Göre Taş Koy */}
            {[...Array(9)].map((_, i) => {
                let content = null;
                // Örnek: Kıstırma Kuralı (Ortada Beyaz, Yanlarda Siyah)
                if (type === 'capture') {
                    if (i === 4) content = <div className="w-6 h-6 rounded-full bg-stone-200 border border-gray-500 shadow-sm opacity-50 relative"><div className="absolute inset-0 flex items-center justify-center text-red-600 font-bold text-lg">✕</div></div>; // Ölen Beyaz
                    if (i === 3 || i === 5) content = <div className="w-6 h-6 rounded-full bg-black border border-gray-600 shadow-sm"></div>; // Siyahlar
                }
                // Örnek: Kralın Kaçışı (Köşeye Gidiş)
                if (type === 'escape') {
                    if (i === 2) content = <div className="w-full h-full bg-[#8d6e63]/50 flex items-center justify-center text-[8px] font-bold text-[#3e2723]">ÇIKIŞ</div>; // Hedef
                    if (i === 4) content = <div className="w-6 h-6 rounded-full bg-[#c5a05a] border border-[#5c4033] shadow-sm animate-pulse"></div>; // Kral
                    if (i === 5) content = <span className="text-xl text-green-700 font-bold">→</span>; // Ok
                }

                return (
                    <div key={i} className="flex items-center justify-center bg-[#e8dcb5]">
                        {content}
                    </div>
                )
            })}
        </div>
    );
};

const Rules = () => {
  return (
    <div className="w-full max-w-5xl h-[80vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#8b7355] scrollbar-track-[#15100d]">
      <h2 className="text-5xl text-[#ffd700] mb-12 text-center drop-shadow-md" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Generalin El Kitabı
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* KURAL 1: HAREKET */}
        <div className="bg-[#15100d] border border-[#3e2723] p-6 flex gap-6 items-start hover:border-[#ffd700]/30 transition-colors group">
            <div className="text-4xl text-[#8b7355] group-hover:text-[#ffd700]">I.</div>
            <div>
                <h3 className="text-xl text-[#d7ccc8] font-bold mb-2">Hareket Kabiliyeti</h3>
                <p className="text-sm text-[#a8a29e] leading-relaxed">
                    Tüm askerler ve Kral, tıpkı Satrançtaki <strong>Kale</strong> gibi yatay ve dikey olarak istedikleri kadar ilerleyebilirler. Ancak taşların üzerinden atlayamazlar.
                </p>
            </div>
        </div>

        {/* KURAL 2: KISTIRMA (GÖRSELLİ) */}
        <div className="bg-[#15100d] border border-[#3e2723] p-6 flex flex-col items-center text-center hover:border-red-900/50 transition-colors">
            <div className="mb-4">
                <MiniBoard type="capture" />
            </div>
            <h3 className="text-xl text-[#d7ccc8] font-bold mb-2">Kıstırma (Esir Alma)</h3>
            <p className="text-sm text-[#a8a29e] leading-relaxed">
                Bir taş, iki düşman taşı arasında (yatay veya dikey) sandviç yapılırsa oyundan çıkarılır. Köşeler de düşman taşı gibi davranır!
            </p>
        </div>

        {/* KURAL 3: KRALIN ZAFERİ (GÖRSELLİ) */}
        <div className="bg-[#15100d] border border-[#3e2723] p-6 flex flex-col items-center text-center hover:border-green-900/50 transition-colors">
            <div className="mb-4">
                <MiniBoard type="escape" />
            </div>
            <h3 className="text-xl text-[#d7ccc8] font-bold mb-2">Kralın Zaferi</h3>
            <p className="text-sm text-[#a8a29e] leading-relaxed">
                Savunanların (Beyaz) amacı, Kralı tahtanın <strong>4 köşesindeki</strong> sığınaklardan birine ulaştırmaktır. Kral köşeye bastığı an oyun biter.
            </p>
        </div>

        {/* KURAL 4: KRALIN YAKALANMASI */}
        <div className="bg-[#15100d] border border-[#3e2723] p-6 flex gap-6 items-start hover:border-[#ffd700]/30 transition-colors group">
            <div className="text-4xl text-[#8b7355] group-hover:text-[#ffd700]">IV.</div>
            <div>
                <h3 className="text-xl text-[#d7ccc8] font-bold mb-2">Kralın Düşüşü</h3>
                <p className="text-sm text-[#a8a29e] leading-relaxed">
                    Kral güçlüdür, bu yüzden esir almak için <strong>4 tarafından</strong> kuşatılması gerekir. Eğer Kral tahtın (merkezin) yanındaysa 3 taraf yeterlidir.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Rules;