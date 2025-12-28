import React from 'react';

const Leaderboard = () => {
  // Sahte Veri
  const players = [
    { rank: 1, name: "Kral Ragnar", wins: 142, faction: "Viking" },
    { rank: 2, name: "ShieldMaiden", wins: 128, faction: "Viking" },
    { rank: 3, name: "Legionary_X", wins: 95, faction: "Rome" },
    { rank: 4, name: "Attila", wins: 88, faction: "Hun" },
  ];

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-5xl text-center text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b] mb-10 drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Efsaneler Salonu
      </h2>

      <div className="bg-[#15100d] border border-[#3e2723] rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Tablo Başlığı */}
        <div className="grid grid-cols-4 bg-[#0c0a09] p-4 text-[#8b7355] text-xs font-bold tracking-widest uppercase border-b border-[#3e2723]">
          <div className="text-center">Sıra</div>
          <div>General</div>
          <div className="text-center">Zafer</div>
          <div className="text-right">Birlik</div>
        </div>

        {/* Satırlar */}
        {players.map((player) => (
          <div key={player.rank} className="grid grid-cols-4 p-4 items-center border-b border-[#3e2723]/30 hover:bg-[#ffd700]/5 transition-colors group cursor-pointer">
            <div className="text-center font-bold text-xl text-[#5d4037] group-hover:text-[#ffd700]">#{player.rank}</div>
            <div className="font-bold text-[#d7ccc8] group-hover:text-white">{player.name}</div>
            <div className="text-center text-[#ffd700]">{player.wins} ⚔</div>
            <div className="text-right text-[#8b7355] text-xs uppercase">{player.faction}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;