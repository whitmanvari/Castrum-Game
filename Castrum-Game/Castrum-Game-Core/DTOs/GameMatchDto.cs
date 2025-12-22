using Castrum_Game_Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Castrum_Game_Core.DTOs
{
    public class GameMatchDto
    {
        public int Id { get; set; }
        public string AttackerName { get; set; }
        public string DefenderName { get; set; }
        public GameStatus Status { get; set; }
        public string CurrentBoardState { get; set; }
        public int TotalMoves { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
