
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
            string[] cols = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" };

            // Satırlar 11'den geriye sayar
            string notation = $"{cols[request.FromCol]}{11 - request.FromRow} -> {cols[request.ToCol]}{11 - request.ToRow}";


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
        public async Task EndGameAsync(EndGameDto request)
        {
            var game = await _context.GameMatches.FirstOrDefaultAsync(g => g.Id == request.GameId);
            if (game == null || game.Status == GameStatus.Finished) return;

            game.Status = GameStatus.Finished;
            game.Winner = request.WinnerSide;
            game.DurationSeconds = (int)(DateTime.Now - game.CreatedDate).TotalSeconds;

            // Kazananı Bul ve İstatistik Güncelle
            string winnerName = (game.Winner == PlayerSide.Attecker) ? game.AttackerName : game.DefenderName;
            string loserName = (game.Winner == PlayerSide.Attecker) ? game.DefenderName : game.AttackerName;

            // Kazanan User Güncellemesi
            var winnerUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == winnerName);
            if (winnerUser != null)
            {
                winnerUser.TotalWins++;
                winnerUser.TotalGamesPlayed++;
            }

            // Kaybeden User Güncellemesi
            var loserUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == loserName);
            if (loserUser != null)
            {
                loserUser.TotalGamesPlayed++;
            }

            _context.GameMatches.Update(game);
            await _context.SaveChangesAsync();
        }

        public async Task<List<LeaderboardDto>> GetLeaderboardAsync()
        {
            return await _context.Users
                .Where(u => u.TotalWins > 0) // Sadece en az 1 zaferi olanları getir
                .OrderByDescending(u => u.TotalWins) // En çok kazanan en üstte
                .Select((u, index) => new LeaderboardDto
                {
                    Rank = index + 1,
                    PlayerName = u.Username,
                    Wins = u.TotalWins,
                    Title = u.TotalWins > 10 ? "EFSANEVİ GENERAL" :
                            (u.TotalWins > 5 ? "SAVAŞ LORDU" :
                            (u.TotalWins > 2 ? "YÜZBAŞI" : "ER"))
                })
                .ToListAsync();
        }
        public async Task<User> LoginAsync(string username)
        {
            username = username.ToUpper().Trim(); // İsim standartlaştırma

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                // Yeni Asker Kaydı
                user = new User
                {
                    Username = username,
                    CreatedDate = DateTime.Now,
                    LastLoginDate = DateTime.Now
                };
                _context.Users.Add(user);
            }
            else
            {
                // Eski Askerin Dönüşü
                user.LastLoginDate = DateTime.Now;
                _context.Users.Update(user);
            }

            await _context.SaveChangesAsync();
            return user;
        }

    }
}
