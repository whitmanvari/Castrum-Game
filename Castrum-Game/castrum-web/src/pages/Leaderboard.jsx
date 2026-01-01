import React, { useEffect, useState } from 'react';
import { gameService } from '../services/gameService';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await gameService.getLeaderboard();
            setPlayers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-[#ffd700] text-center mt-20">Veriler taranıyor...</div>;

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-5xl text-center text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b] mb-10 drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Efsaneler Salonu
      </h2>

      <div className="bg-[#15100d] border border-[#3e2723] rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-4 bg-[#0c0a09] p-4 text-[#8b7355] text-xs font-bold tracking-widest uppercase border-b border-[#3e2723]">
          <div className="text-center">Sıra</div>
          <div>General</div>
          <div className="text-center">Zafer</div>
          <div className="text-right">Rütbe</div>
        </div>

        {players.length === 0 && <div className="p-8 text-center text-gray-500">Henüz hiç savaş kazanılmadı...</div>}

        {players.map((player) => (
          <div key={player.rank} className="grid grid-cols-4 p-4 items-center border-b border-[#3e2723]/30 hover:bg-[#ffd700]/5 transition-colors group cursor-pointer">
            <div className="text-center font-bold text-xl text-[#5d4037] group-hover:text-[#ffd700]">#{player.rank}</div>
            <div className="font-bold text-[#d7ccc8] group-hover:text-white uppercase">{player.playerName}</div>
            <div className="text-center text-[#ffd700]">{player.wins} ⚔</div>
            <div className="text-right text-[#8b7355] text-xs uppercase">{player.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;