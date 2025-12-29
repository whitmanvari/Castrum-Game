import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import GameBoard from './components/GameBoard';
import Tournament from './pages/Tournament';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';

// --- YARDIMCI BİLEŞENLER (SAĞ PANEL İÇİN) ---

const HistoryItem = ({ turn, text, side, special }) => (
    <div className={`text-xs p-2 border-l-2 ${side === 'enemy' ? 'border-red-900 bg-red-900/10' : 'border-[#8b7355] bg-[#8b7355]/10'} flex gap-2 animate-fade-in`}>
        <span className="font-bold opacity-50">{turn}.</span>
        <span className={special ? "text-[#ffd700]" : "text-[#d7ccc8]"}>{text}</span>
    </div>
);

const ControlBtn = ({ icon, tooltip, highlight }) => (
    <button className={`
        w-10 h-10 rounded border flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative
        ${highlight 
            ? 'bg-[#ffd700] text-black border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
            : 'bg-[#15100d] text-[#8b7355] border-[#3e2723] hover:border-[#ffd700] hover:text-[#ffd700]'}
    `}>
        {icon}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {tooltip}
        </span>
    </button>
);

// --- SAVAŞ ALANI (WRAPPER) ---
const BattlefieldWrapper = () => {
  const { id } = useParams(); 
  const location = useLocation();
  
  // STATE: Hamle Geçmişini Burada Tutuyoruz
  const [logs, setLogs] = useState([]);
  const [turnCount, setTurnCount] = useState(1);

  // Bu fonksiyonu GameBoard çağıracak
  const handleNewLog = (logText, side) => {
      const newLog = { 
          id: Date.now(), 
          turn: turnCount, 
          text: logText, 
          side: side 
      };
      setLogs(prev => [newLog, ...prev]); 
      setTurnCount(prev => prev + 1);
  };
  
  const p1Name = location.state?.p1 || "Savunan";
  const p2Name = location.state?.p2 || "Saldıran";

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full h-full items-start justify-center animate-fade-in">
        
        {/* SOL: OYUN TAHTASI */}
        <div className="flex-1 flex justify-center items-center w-full">
            {/* onMove ile GameBoard'dan veriyi alıyoruz */}
            <GameBoard gameId={id} onMove={handleNewLog} />
        </div>

        {/* SAĞ: KOMUTA MERKEZİ */}
        <div className="w-full md:w-80 bg-[#15100d] border border-[#3e2723] shadow-2xl flex flex-col h-[600px] relative shrink-0">
            
            {/* 1. Oyuncu Bilgileri */}
            <div className="p-4 border-b border-[#3e2723] bg-[#0c0a09]/50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[#d7ccc8] font-bold text-sm">🛡️ {p1Name}</span>
                    <span className="text-[#ffd700] font-bold text-xs">SIRA SENDE</span>
                </div>
                <div className="w-full bg-[#2c1e16] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#ffd700] w-3/4 h-full shadow-[0_0_10px_#ffd700]"></div>
                </div>
                <div className="flex justify-between items-center mt-2 opacity-50">
                     <span className="text-[#8b7355] text-xs">⚔️ {p2Name}</span>
                     <span className="text-xs">Bekliyor...</span>
                </div>
            </div>

            {/* 2. Hamle Geçmişi (Canlı) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#3e2723] scrollbar-track-transparent">
                <div className="text-[10px] text-[#5d4037] uppercase tracking-widest text-center mb-2">- Savaş Günlüğü -</div>
                
                {logs.length === 0 && <div className="text-center text-gray-600 text-xs italic mt-10">Savaş başlamadı...</div>}

                {logs.map(log => (
                    <HistoryItem key={log.id} turn={log.turn} text={log.text} side={log.side} />
                ))}
            </div>

            {/* 3. Kontroller */}
            <div className="p-4 border-t border-[#3e2723] bg-[#0c0a09]">
                <div className="text-[10px] text-[#8b7355] text-center mb-2 font-bold tracking-widest">ZAMANI KONTROL ET</div>
                <div className="flex justify-center gap-2">
                    <ControlBtn icon="⏮" tooltip="Başa Sar" />
                    <ControlBtn icon="◀" tooltip="Geri Al" />
                    <ControlBtn icon="▶" tooltip="Oynat" highlight />
                    <ControlBtn icon="▶" tooltip="İleri Sar" />
                    <ControlBtn icon="⏭" tooltip="Son Durum" />
                </div>
            </div>

        </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Tournament />} /> 
          <Route path="/game/:id" element={<BattlefieldWrapper />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;