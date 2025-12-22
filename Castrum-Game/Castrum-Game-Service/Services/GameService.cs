
using Castrum_Game_Core;
using Castrum_Game_Core.DTOs;
using Castrum_Game_Core.Enums;
using Castrum_Game_Core.Interfaces;
using Castrum_Game_Data;
using Microsoft.EntityFrameworkCore;

namespace Castrum_Game_Service.Services
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _context;

        public GameService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<GameMatchDto> CreateGameAsync(CreateGameDto request)
        {
            var newMatch = new GameMatch
            {
                AttackerName = request.AttackerName,
                DefenderName = request.DefenderName,
                Status = GameStatus.OnGoing,
                TotalMoves = 0,
                CurrentBoardState = "START_POSITION_STRING",
                DurationSeconds = 0
            };

            _context.GameMatches.Add(newMatch);
            await _context.SaveChangesAsync();

            return new GameMatchDto
            {
                Id = newMatch.Id,
                AttackerName = newMatch.AttackerName,
                DefenderName = newMatch.DefenderName,
                Status = newMatch.Status,
                CurrentBoardState = newMatch.CurrentBoardState,
                CreatedDate = newMatch.CreatedDate,
                TotalMoves = 0
            };
        }
        public async Task<List<GameMatchDto>> GetAllGamesAsync()
        {
            // Veritabanından çekip DTO'ya çeviriyoruz
            return await _context.GameMatches
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new GameMatchDto
                {
                    Id = x.Id,
                    AttackerName = x.AttackerName,
                    DefenderName = x.DefenderName,
                    Status = x.Status,
                    TotalMoves = x.TotalMoves,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();
        }
        public async Task<GameMatch> GetGameByIdAsync(int id)
        {
            // Hamleleri de (Moves) getir ki tekrar oynatabilelim
            return await _context.GameMatches
                .Include(x => x.Moves)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

    }
}
