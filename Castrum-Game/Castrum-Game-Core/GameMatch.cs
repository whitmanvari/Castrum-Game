using Castrum_Game_Core.Enums;

namespace Castrum_Game_Core
{
    public class GameMatch: BaseEntity
    {
        //Oyuncu isimleri 
        public string AttackerName { get; set; } = "Player 1";
        public string DefenderName { get; set; } = "Player 2";
        public GameStatus Status { get; set; } = GameStatus.OnGoing;
        public PlayerSide? Winner { get; set; } //Kim kazandı? Null olabilir, game aborted olabilir.
        public int TotalMoves { get; set; } = 0;
        public ICollection<GameMove> Moves { get; set; } 
        public string CurrentBoardState { get; set; } //Mevcut tahtanın FEN benzeri string gösterimi
        public int DurationSeconds { get; set; } = 0; //Maç süresi saniye cinsinden
    }
}
