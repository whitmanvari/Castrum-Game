const API_BASE_URL = "https://localhost:7034/api"; 

export const gameService = {
  // Yeni oyun oluşturma isteği
  createGame: async (attackerName, defenderName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attackerName: attackerName,
          defenderName: defenderName
        })
      });

      if (!response.ok) {
        throw new Error('Oyun oluşturulamadı!');
      }

      return await response.json();
    } catch (error) {
      console.error("API Hatası:", error);
      throw error;
    }
  }
};