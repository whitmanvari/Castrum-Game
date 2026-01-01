import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import GameBoard from './components/GameBoard';
import Tournament from './pages/Tournament'; // Lobi
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';
import VictoryModal from './components/VictoryModal';
import { initializeBoard } from './utils/gameLogic';

// --- YARDIMCI BİLEŞEN: GEÇMİŞ SATIRI ---
const HistoryItem = ({ turn, text, side }) => (
    <div className={`text-[10px] md:text-sm p-2 border-l-4 rounded bg-[#0c0a09]/80 mb-2 font-readable tracking-wide flex justify-between items-center animate-fade-in
        ${side === 'enemy' ? 'border-red-900 shadow-[inset_0_0_10px_rgba(127,29,29,0.2)]' : 'border-[#8b7355] shadow-[inset_0_0_10px_rgba(139,115,85,0.2)]'}`}>
        <span className="font-bold text-[#8b7355]">#{turn}</span>
        <span className="text-gray-200">{text}</span>
    </div>
);

// --- YARDIMCI BİLEŞEN: KONTROL BUTONU ---
const ControlBtn = ({ icon, onClick, disabled, highlight }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`
        w-10 h-10 md:w-12 md:h-12 rounded border flex items-center justify-center transition-all relative group
        ${disabled ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-800' : 
          highlight ? 'bg-[#ffd700] text-black border-[#ffd700] hover:scale-110 shadow-[0_0_20px_#ffd700]' : 
          'bg-[#15100d] text-[#8b7355] border-[#3e2723] hover:border-[#ffd700] hover:text-[#ffd700] hover:scale-105'}
    `}>
        <span className="text-xl">{icon}</span>
    </button>
);

// --- ANA OYUN SARMALAYICISI (LOGIC BURADA) ---
const BattlefieldWrapper = ({ onGameOver }) => {
  const { id } = useParams(); 
  const location = useLocation();
  
  // İsimleri al (yoksa varsayılan ata)
  const p1Name = location.state?.p1 || "Savunan";
  const p2Name = location.state?.p2 || "Saldıran";

  const [history, setHistory] = useState([]); 
  const [logs, setLogs] = useState([]);      
  const [step, setStep] = useState(0);       

  // Sıra hesabı: Çift sayılar (0,2,4) Savunan, Tek sayılar (1,3,5) Saldıran
  const isDefenderTurn = step % 2 === 0;

  // İlk yüklemede tahtayı kur
  useEffect(() => {
    const initialBoard = initializeBoard();
    setHistory([initialBoard]); 
  }, []);

  // Hamle yapıldığında çalışır
  const handleMoveMade = (newBoard, logText, side) => {
      // Geçmişi güncelle (Geri sarıp hamle yapıldıysa geleceği sil)
      const newHistory = history.slice(0, step + 1);
      setHistory([...newHistory, newBoard]);
      
      const newLog = { id: Date.now(), text: logText, side: side };
      setLogs([newLog, ...logs]); 
      
      setStep(newHistory.length);
  };

  const currentBoard = history[step];
  const isReplayMode = step < history.length - 1;

  // Zaman Kontrolleri
  const goBack = () => setStep(prev => Math.max(0, prev - 1));
  const goForward = () => setStep(prev => Math.min(history.length - 1, prev + 1));
  const goStart = () => setStep(0);
  const goEnd = () => setStep(history.length - 1);

  if (!currentBoard) return <div className="text-center text-[#ffd700] mt-20 animate-pulse">Savaş Alanı Hazırlanıyor...</div>;

  return (
    <div className="
        flex flex-col lg:flex-row 
        gap-6 lg:gap-8 
        w-full h-full 
        items-center lg:items-start 
        justify-start lg:justify-center 
        pt-6 lg:pt-10 pb-20 lg:pb-0
        animate-fade-in
    ">
        
        {/* SOL: OYUN TAHTASI */}
        <div className="flex-1 flex justify-center items-center w-full relative order-1 px-2">
            {isReplayMode && (
                <div className="absolute top-0 lg:top-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold z-50 shadow-lg animate-pulse">
                    ⚠️ GEÇMİŞİ İZLİYORSUNUZ
                </div>
            )}
            
            <GameBoard 
                gameId={id} 
                board={currentBoard} 
                onBoardUpdate={handleMoveMade} 
                onWin={(winner, msg) => onGameOver && onGameOver(winner, msg)} 
                isReplayMode={isReplayMode} 
                p1Name={p1Name}
                p2Name={p2Name}
            />
        </div>

        {/* SAĞ: KOMUTA MERKEZİ */}
        <div className="w-full lg:w-96 bg-[#15100d] border border-[#3e2723] shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col h-[400px] lg:h-[650px] shrink-0 rounded-lg overflow-hidden transition-all order-2 mb-10 lg:mb-0">
            
            {/* OYUNCU KARTLARI */}
            <div className="flex lg:block border-b border-[#3e2723]">
                {/* Savunan Kartı */}
                <div className={`flex-1 p-3 lg:p-5 transition-all duration-500 relative overflow-hidden ${isDefenderTurn ? 'bg-gradient-to-r from-[#1a120b] to-[#3e2723]/40 border-b-4 lg:border-b-0 lg:border-l-4 border-[#ffd700]' : 'bg-[#0c0a09] opacity-50 grayscale'}`}>
                    <span className={`font-bold text-sm lg:text-lg block text-center lg:text-left ${isDefenderTurn ? 'text-[#ffd700]' : 'text-[#d7ccc8]'}`}>
                        🛡️ {p1Name}
                    </span>
                </div>
                {/* Saldıran Kartı */}
                <div className={`flex-1 p-3 lg:p-5 transition-all duration-500 relative overflow-hidden border-l lg:border-l-0 lg:border-t border-[#3e2723] ${!isDefenderTurn ? 'bg-gradient-to-r from-[#1a0505] to-[#3e2723]/40 border-b-4 lg:border-b-0 lg:border-l-4 border-red-600' : 'bg-[#0c0a09] opacity-50 grayscale'}`}>
                    <span className={`font-bold text-sm lg:text-lg block text-center lg:text-left ${!isDefenderTurn ? 'text-red-500' : 'text-[#8b7355]'}`}>
                        ⚔️ {p2Name}
                    </span>
                </div>
            </div>

            {/* LOGLAR */}
            <div className="flex-1 overflow-y-auto p-2 lg:p-4 bg-[#0a0908] scrollbar-thin">
                {logs.length === 0 ? <div className="text-center text-gray-600 text-xs italic mt-4">Savaş Başlıyor...</div> : logs.map((log, index) => (
                     <HistoryItem key={log.id} turn={logs.length - index} text={log.text} side={log.side} />
                ))}
            </div>

            {/* KONTROLLER */}
            <div className="p-2 lg:p-4 border-t border-[#3e2723] bg-[#15100d]">
                <div className="flex justify-center gap-2 lg:gap-3">
                    <ControlBtn icon="⏮" onClick={goStart} disabled={step === 0} />
                    <ControlBtn icon="◀" onClick={goBack} disabled={step === 0} />
                    <ControlBtn icon="▶" highlight disabled={!isReplayMode} onClick={goEnd} />
                    <ControlBtn icon="▶" onClick={goForward} disabled={step === history.length - 1} />
                    <ControlBtn icon="⏭" onClick={goEnd} disabled={step === history.length - 1} />
                </div>
            </div>

        </div>
    </div>
  );
};

// --- ANA UYGULAMA ROTASI ---
function App() {
  const [modalData, setModalData] = useState({ isOpen: false, winner: '', msg: '' });

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. GİRİŞ SAYFASI (Layout Dışında - Tam Ekran) */}
        <Route path="/" element={<Login />} />

        {/* 2. DİĞER TÜM SAYFALAR (Layout İçinde - Menülü) */}
        <Route path="/*" element={
            <Layout>
                 {/* Global Zafer Modalı */}
                 <VictoryModal 
                    isOpen={modalData.isOpen} 
                    winnerName={modalData.winner} 
                    message={modalData.msg}
                    onClose={() => setModalData({ ...modalData, isOpen: false })}
                />
                
                <Routes>
                    <Route path="/lobby" element={<Tournament />} /> 
                    <Route path="/game/:id" element={<BattlefieldWrapper onGameOver={(w, m) => setModalData({ isOpen: true, winner: w, msg: m })} />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
            </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;