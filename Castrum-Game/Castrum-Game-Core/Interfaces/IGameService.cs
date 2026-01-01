using Castrum_Game_Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Castrum_Game_Core.Interfaces
{
    public interface IGameService
    {
        Task<GameMatchDto> CreateGameAsync(CreateGameDto request);
        Task<GameMatch> GetGameByIdAsync(int id);
        Task<List<GameMatchDto>> GetAllGamesAsync();
        Task<GameMove> MakeMoveAsync(CreateMoveDto request);
        Task<List<LeaderboardDto>> GetLeaderboardAsync();
    }
}