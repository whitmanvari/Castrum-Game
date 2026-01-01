namespace Castrum_Game_Core.DTOs
{
    public class CreateMoveDto
    {
        public int GameId { get; set; }
        public int FromRow { get; set; }
        public int FromCol { get; set; }
        public int ToRow { get; set; }
        public int ToCol { get; set; }
        public string? BoardSnapshot { get; set; } // Tahtanın o anki görüntüsü
    }
}