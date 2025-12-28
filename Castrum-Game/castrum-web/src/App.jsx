import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GameBoard from './components/GameBoard'; // Oyun Tahtamız
import Lobby from './pages/Lobby';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';

// Savaş Alanı Sayfası (Wrapper)
const Battlefield = () => (
  <div className="flex flex-col items-center animate-fade-in">
    <GameBoard />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Battlefield />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;