namespace Castrum_Game_Core.DTOs
{
    public class LeaderboardDto
    {
        public int Rank { get; set; }
        public string PlayerName { get; set; }
        public int Wins { get; set; }
        public string Title { get; set; } // "General", "Komutan" vs.
    }
}
