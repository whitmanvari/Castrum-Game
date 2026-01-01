
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
        public async Task<List<LeaderboardDto>> GetLeaderboardAsync()
        {
            // 1. Biten ve kazananı olan maçları çek
            var finishedGames = await _context.GameMatches
                .Where(g => g.Status == GameStatus.Finished && g.Winner != null)
                .ToListAsync();

            // 2. Kazanan İsimlerini Listele
            var winners = new List<string>();

            foreach (var game in finishedGames)
            {
                if (game.Winner == PlayerSide.Attecker)
                    winners.Add(game.AttackerName);
                else if (game.Winner == PlayerSide.Defender)
                    winners.Add(game.DefenderName);
            }

            // 3. Grupla ve Say (En çok kazanan en üstte)
            var leaderboard = winners
                .GroupBy(name => name)
                .Select(group => new
                {
                    Name = group.Key,
                    WinCount = group.Count()
                })
                .OrderByDescending(x => x.WinCount)
                .Select((x, index) => new LeaderboardDto
                {
                    Rank = index + 1,
                    PlayerName = x.Name,
                    Wins = x.WinCount,
                    Title = x.WinCount > 10 ? "Efsanevi General" : (x.WinCount > 5 ? "Savaş Lordu" : "Acemi Asker")
                })
                .ToList();

            return leaderboard;
        }

        public async Task<GameMove> MakeMoveAsync(CreateMoveDto request)
        {
            // 1. Oyunu ve geçmiş hamleleri çek
            var game = await _context.GameMatches
                                     .Include(g => g.Moves)
                                     .FirstOrDefaultAsync(g => g.Id == request.GameId);

            if (game == null) throw new Exception("Oyun bulunamadı!");

            // 2. Hamle Sırasını ve Oyuncuyu Belirle
            int moveCount = game.Moves != null ? game.Moves.Count : 0;
            int nextMoveNumber = moveCount + 1;

            // Tek sayılar (1,3,5) -> Defender (Beyaz), Çiftler -> Attacker (Siyah) varsayımı
            // 1=Attacker, 2=Defender
            PlayerSide currentPlayer = (nextMoveNumber % 2 != 0) ? PlayerSide.Defender : PlayerSide.Attecker;

            // 3. Notasyon Oluştur (Örn: A1 -> B1)
            string[] cols = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M" };
            // Satırlar ters mantıkta (13 aşağıdan yukarıya)
            string notation = $"{cols[request.FromCol]}{13 - request.FromRow} -> {cols[request.ToCol]}{13 - request.ToRow}";

            // 4. Yeni Hamle Kaydı Oluştur
            var newMove = new GameMove
            {
                GameMatchId = request.GameId,
                Player = currentPlayer,
                MoveNumber = nextMoveNumber, 
                FromRow = request.FromRow,
                FromCol = request.FromCol,
                ToRow = request.ToRow,
                ToCol = request.ToCol,
                Notation = notation,
                IsCapture = false, 
                BoardSnapshot = request.BoardSnapshot ?? "UPDATED",
                CreatedDate = DateTime.Now
            };

            // 5. Maçın Durumunu Güncelle
            game.TotalMoves = nextMoveNumber;
            game.CurrentBoardState = request.BoardSnapshot ?? game.CurrentBoardState;

            // 6. Veritabanına Kaydet
            _context.GameMoves.Add(newMove);
            _context.GameMatches.Update(game);
            await _context.SaveChangesAsync();

            return newMove;
        }

    }
}
