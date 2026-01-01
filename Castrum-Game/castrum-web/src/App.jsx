import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import GameBoard from './components/GameBoard';
import Tournament from './pages/Tournament';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';
import VictoryModal from './components/VictoryModal'; // Modal bileşeni
import { initializeBoard } from './utils/gameLogic';

// --- YARDIMCI BİLEŞENLER ---
const HistoryItem = ({ turn, text, side }) => (
    <div className={`text-sm p-3 border-l-4 rounded bg-[#0c0a09]/80 mb-2 font-readable tracking-wide flex justify-between items-center
        ${side === 'enemy' ? 'border-red-900 shadow-[inset_0_0_10px_rgba(127,29,29,0.2)]' : 'border-[#8b7355] shadow-[inset_0_0_10px_rgba(139,115,85,0.2)]'}`}>
        <span className="font-bold text-[#8b7355]">#{turn}</span>
        <span className="text-gray-200">{text}</span>
    </div>
);

const ControlBtn = ({ icon, tooltip, onClick, disabled, highlight }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`
        w-12 h-12 rounded border flex items-center justify-center transition-all relative group
        ${disabled ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-800' : 
          highlight ? 'bg-[#ffd700] text-black border-[#ffd700] hover:scale-110 shadow-[0_0_20px_#ffd700]' : 
          'bg-[#15100d] text-[#8b7355] border-[#3e2723] hover:border-[#ffd700] hover:text-[#ffd700] hover:scale-105'}
    `}>
        <span className="text-xl">{icon}</span>
        {!disabled && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-sans">
                {tooltip}
            </span>
        )}
    </button>
);

// --- SAVAŞ ALANI (STATE YÖNETİMİ) ---
const BattlefieldWrapper = ({ onGameOver }) => {
  const { id } = useParams(); 
  const location = useLocation();
  
  // Oyuncu İsimleri (Turnuvadan gelir, yoksa varsayılan)
  const p1Name = location.state?.p1 || "Savunan";
  const p2Name = location.state?.p2 || "Saldıran";

  // STATE: Oyun Geçmişi ve Loglar
  const [history, setHistory] = useState([]); 
  const [logs, setLogs] = useState([]);      
  const [step, setStep] = useState(0);       

  // 1. Başlangıçta Tahtayı Kur
  useEffect(() => {
    const initialBoard = initializeBoard();
    setHistory([initialBoard]); 
  }, []);

  // 2. Yeni Hamle Yapıldığında (GameBoard tetikler)
  const handleMoveMade = (newBoard, logText, side) => {
      // Eğer geçmişe dönüp hamle yapıldıysa, geleceği sil (Alternatif tarih)
      const newHistory = history.slice(0, step + 1);
      const newLogs = logs.slice(0, step);

      setHistory([...newHistory, newBoard]);
      
      const newLog = { id: Date.now(), text: logText, side: side };
      setLogs([newLog, ...newLogs]); // En yeni log en üstte

      setStep(newHistory.length); // Son adıma git
  };

  // 3. Zafer Durumu (GameBoard tetikler)
  const triggerWin = (winnerName, msg) => {
      if (onGameOver) onGameOver(winnerName, msg);
  };

  // Şu an gösterilecek tahta
  const currentBoard = history[step];
  // Replay modunda mıyız? (Son adımda değilsek evet)
  const isReplayMode = step < history.length - 1;

  // --- KONTROL FONKSİYONLARI ---
  const goBack = () => setStep(prev => Math.max(0, prev - 1));
  const goForward = () => setStep(prev => Math.min(history.length - 1, prev + 1));
  const goStart = () => setStep(0);
  const goEnd = () => setStep(history.length - 1);

  if (!currentBoard) return <div className="text-center text-[#ffd700] mt-20">Savaş Alanı Hazırlanıyor...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full h-full items-start justify-center animate-fade-in pb-20">
        
        {/* SOL: OYUN TAHTASI */}
        <div className="flex-1 flex justify-center items-center w-full relative">
            {isReplayMode && (
                <div className="absolute top-4 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold z-50 shadow-lg animate-pulse">
                    ⚠️ GEÇMİŞİ İZLİYORSUNUZ
                </div>
            )}
            
            <GameBoard 
                gameId={id} 
                board={currentBoard}          // App'ten gelen anlık tahta
                onBoardUpdate={handleMoveMade} // Hamle yapınca App'e bildir
                onWin={triggerWin}            // Kazanılınca App'e bildir
                isReplayMode={isReplayMode}   // İzleme modundaysa tıklamayı kapat
                p1Name={p1Name}
                p2Name={p2Name}
            />
        </div>

        {/* SAĞ: KOMUTA MERKEZİ */}
        <div className="w-full md:w-96 bg-[#15100d] border border-[#3e2723] shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col h-[650px] shrink-0 rounded-lg overflow-hidden">
            
            {/* Oyuncu Bilgileri */}
            <div className="p-5 border-b border-[#3e2723] bg-gradient-to-r from-[#0c0a09] to-[#1a120b]">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[#d7ccc8] font-bold text-base flex items-center gap-2">
                        🛡️ {p1Name} <span className="text-[10px] text-gray-500">(Savunan)</span>
                    </span>
                </div>
                <div className="flex justify-between items-center opacity-70">
                     <span className="text-[#8b7355] text-sm font-bold flex items-center gap-2">
                        ⚔️ {p2Name} <span className="text-[10px] text-gray-500">(Saldıran)</span>
                     </span>
                </div>
            </div>

            {/* Hamle Logları */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0a0908] scrollbar-thin scrollbar-thumb-[#3e2723] scrollbar-track-transparent">
                <div className="text-[10px] text-[#5d4037] uppercase tracking-[0.2em] text-center mb-4 border-b border-[#3e2723]/30 pb-2">
                    - Savaş Günlüğü -
                </div>
                
                {logs.length === 0 ? (
                    <div className="text-center text-gray-600 text-sm italic mt-10">Savaş henüz başlamadı...</div>
                ) : (
                    logs.map((log, index) => (
                        <HistoryItem 
                            key={log.id} 
                            turn={logs.length - index} 
                            text={log.text} 
                            side={log.side} 
                        />
                    ))
                )}
            </div>

            {/* Kontroller */}
            <div className="p-4 border-t border-[#3e2723] bg-[#15100d]">
                <div className="text-[10px] text-[#8b7355] text-center mb-3 font-bold tracking-widest uppercase">
                    Zamanı Kontrol Et ({step} / {history.length - 1})
                </div>
                <div className="flex justify-center gap-3">
                    <ControlBtn icon="⏮" tooltip="Başa Dön" onClick={goStart} disabled={step === 0} />
                    <ControlBtn icon="◀" tooltip="Geri Al" onClick={goBack} disabled={step === 0} />
                    
                    <ControlBtn icon="▶" tooltip="Canlı" highlight disabled={!isReplayMode} onClick={goEnd} />
                    
                    <ControlBtn icon="▶" tooltip="İleri Sar" onClick={goForward} disabled={step === history.length - 1} />
                    <ControlBtn icon="⏭" tooltip="Sona Git" onClick={goEnd} disabled={step === history.length - 1} />
                </div>
            </div>

        </div>
    </div>
  );
};

// --- ANA APP ---
function App() {
  // Modal State
  const [modalData, setModalData] = useState({ isOpen: false, winner: '', msg: '' });

  const handleGameOver = (winner, msg) => {
    setModalData({ isOpen: true, winner, msg });
  };

  return (
    <BrowserRouter>
      <Layout>
        {/* ZAFER PENCERESİ */}
        <VictoryModal 
            isOpen={modalData.isOpen} 
            winnerName={modalData.winner} 
            message={modalData.msg}
            onClose={() => setModalData({ ...modalData, isOpen: false })}
        />

        <Routes>
          <Route path="/" element={<Tournament />} /> 
          <Route path="/game/:id" element={<BattlefieldWrapper onGameOver={handleGameOver} />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;