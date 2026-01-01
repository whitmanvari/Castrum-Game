import React, { useEffect, useState } from 'react';
import { gameService } from '../services/gameService';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// DÜZELTME 1: Crown import edildi!
import { Trophy, Medal, Star, TrendingUp, Crown } from 'lucide-react'; 
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await gameService.getLeaderboard();
            setPlayers(data);
        } catch (error) {
            console.error("Liderlik verisi çekilemedi:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Grafik Verisi (İlk 5 Kişi)
  const chartData = players.slice(0, 5).map(p => ({
    name: p.playerName.length > 8 ? p.playerName.substring(0, 8) + '...' : p.playerName,
    wins: p.wins
  }));

  if (loading) return <div className="flex h-full items-center justify-center text-[#ffd700] animate-pulse">Veriler Analiz Ediliyor...</div>;

  return (
    <div className="w-full h-full overflow-y-auto px-4 pb-20 pt-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Başlık Alanı */}
        <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffd700] drop-shadow-sm" style={{ fontFamily: "'Cinzel', serif" }}>
                EFSANELER SALONU
            </h2>
            <p className="text-gray-400 text-xs tracking-[0.3em] uppercase">En Çok Zafer Kazanan Generaller</p>
        </div>

        {/* Üst İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Şampiyon Kartı */}
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-black border border-[#ffd700]/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.1)] flex flex-col items-center justify-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-2 text-[#ffd700]/10"><Trophy size={100} /></div>
                <div className="text-[#ffd700] mb-2"><Crown size={40} /></div>
                <div className="text-3xl font-bold text-white mb-1">
                    {players.length > 0 ? players[0].playerName : "-"}
                </div>
                <div className="text-xs text-[#ffd700] tracking-widest uppercase">Mevcut Şampiyon</div>
                <div className="mt-4 text-4xl font-black text-white">
                    {players.length > 0 ? players[0].wins : 0} 
                    <span className="text-sm text-gray-500 font-normal ml-2">Zafer</span>
                </div>
            </motion.div>

            {/* Grafik Alanı */}
            {/* DÜZELTME 2: h-64 yerine h-[300px] ve min-height vererek grafiğin çökmesini engelledik */}
            <div className="md:col-span-2 bg-[#1a1a1a]/50 border border-white/5 p-6 rounded-2xl relative h-[300px] flex flex-col">
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Zafer Analizi (Top 5)
                </h3>
                
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#ffd700' }}
                                cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                            />
                            <Bar dataKey="wins" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ffd700' : '#404040'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Detaylı Liste Tablosu */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 bg-black/40 p-4 text-gray-500 text-xs font-bold tracking-widest uppercase border-b border-white/5">
                <div className="col-span-2 text-center">Sıra</div>
                <div className="col-span-6">General</div>
                <div className="col-span-2 text-center">Zafer</div>
                <div className="col-span-2 text-right pr-4">Rütbe</div>
            </div>

            <div className="divide-y divide-white/5">
                {players.map((player, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        className={`grid grid-cols-12 p-4 items-center hover:bg-white/5 transition-colors group
                            ${index === 0 ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent' : ''}
                        `}
                    >
                        <div className="col-span-2 flex justify-center">
                            {index === 0 ? <Medal className="text-[#ffd700]" /> : 
                             index === 1 ? <Medal className="text-gray-400" /> : 
                             index === 2 ? <Medal className="text-amber-700" /> : 
                             <span className="text-gray-500 font-bold">#{player.rank}</span>}
                        </div>
                        <div className="col-span-6 font-bold text-gray-200 group-hover:text-white transition-colors flex items-center gap-3">
                            {player.playerName}
                            {index === 0 && <Star size={14} className="text-[#ffd700] fill-[#ffd700] animate-pulse" />}
                        </div>
                        <div className="col-span-2 text-center font-bold text-[#ffd700]">
                            {player.wins}
                        </div>
                        <div className="col-span-2 text-right pr-4 text-xs text-gray-500 uppercase">
                            {player.title}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {players.length === 0 && (
                <div className="p-10 text-center text-gray-600 italic">
                    Henüz savaş kaydı bulunmuyor. İlk savaşı sen başlat!
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;