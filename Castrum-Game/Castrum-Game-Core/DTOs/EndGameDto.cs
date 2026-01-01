using Castrum_Game_Core.Enums;


namespace Castrum_Game_Core.DTOs
{
    public class EndGameDto
    {
        public int GameId { get; set; }
        public PlayerSide WinnerSide { get; set; } // 1: Attacker, 2: Defender
    }
}
