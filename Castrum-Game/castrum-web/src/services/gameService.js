const API_BASE_URL = "https://localhost:7034/api"; // Backend portunu kontrol et!

export const gameService = {
  // 1. Yeni Oyun Oluştur
  createGame: async (attackerName, defenderName) => {
    const response = await fetch(`${API_BASE_URL}/Games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attackerName, defenderName })
    });
    if (!response.ok) throw new Error('Oyun oluşturulamadı');
    return await response.json();
  },

  // 2. Oyunu Getir (ID ile)
  getGame: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/Games/${gameId}`);
    if (!response.ok) throw new Error('Oyun bulunamadı');
    return await response.json();
  },

  // 3. Hamle Yap
  makeMove: async (gameId, fromRow, fromCol, toRow, toCol) => {
    const response = await fetch(`${API_BASE_URL}/Games/${gameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromRow, fromCol, 
        toRow, toCol
      })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Hamle geçersiz');
    }
    return await response.json(); // Güncel oyun durumunu dönmeli
  }
};