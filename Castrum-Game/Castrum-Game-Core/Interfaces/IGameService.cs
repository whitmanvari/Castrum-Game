using Castrum_Game_Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Castrum_Game_Core.Interfaces
{
    public interface IGameService
    {
        // Yeni oyun başlatır
        Task<GameMatchDto> CreateGameAsync(CreateGameDto request);

        // ID'si verilen oyunun detayını getirir
        Task<GameMatch> GetGameByIdAsync(int id);

        // Tüm oyunları listeler (Geçmiş maçlar sayfası için)
        Task<List<GameMatchDto>> GetAllGamesAsync();
    }
}
