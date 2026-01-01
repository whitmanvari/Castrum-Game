using System.ComponentModel.DataAnnotations;

namespace Castrum_Game_Core
{
    public class User: BaseEntity
    {
        [Required]
        public string Username { get; set; } 
        public int TotalWins { get; set; } = 0;
        public int TotalGamesPlayed { get; set; } = 0;
        public DateTime LastLoginDate { get; set; } = DateTime.Now;
    }
}
