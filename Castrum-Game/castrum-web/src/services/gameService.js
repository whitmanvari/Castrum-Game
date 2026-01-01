const API_BASE_URL = "https://localhost:7034/api"; // Portunu kontrol et!

export const gameService = {
  // GİRİŞ YAP
  login: async (username) => {
    const response = await fetch(`${API_BASE_URL}/Games/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!response.ok) throw new Error('Giriş başarısız');
    return await response.json(); // User objesi döner (Id, Username, Wins...)
  },

  createGame: async (attackerName, defenderName) => {
    const response = await fetch(`${API_BASE_URL}/Games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attackerName, defenderName })
    });
    if (!response.ok) throw new Error('Oyun oluşturulamadı');
    return await response.json();
  },

  getGame: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/Games/${gameId}`);
    if (!response.ok) throw new Error('Oyun bulunamadı');
    return await response.json();
  },

  makeMove: async (gameId, fromRow, fromCol, toRow, toCol) => {
    const response = await fetch(`${API_BASE_URL}/Games/${gameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromRow, fromCol, toRow, toCol })
    });
    if (!response.ok) throw new Error('Hamle geçersiz');
    return await response.json();
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_BASE_URL}/Games/leaderboard`);
    if (!response.ok) throw new Error('Liderlik tablosu alınamadı');
    return await response.json();
  },

  endGame: async (gameId, winnerSide) => {
    const response = await fetch(`${API_BASE_URL}/Games/${gameId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerSide })
    });
    if (!response.ok) throw new Error('Oyun sonlandırılamadı');
    return await response.json();
  }
};