using Castrum_Game_Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Castrum_Game_Core
{
    public class GameMove: BaseEntity
    {
        public int GameMatchId { get; set; } //Hangi maça ait?
        [ForeignKey("GameMatchId")]
        public GameMatch GameMatch { get; set; }
        public string MoveNumber { get; set; } //1. hamle, 2.hamle gibi
        public PlayerSide Player { get; set; } //Kim oynadı?

        //Koordinatlar
        public int FromRow { get; set; } 
        public int FromCol { get; set; }
        public int ToRow { get; set; }
        public int ToCol { get; set; }

        //Görsel Notasyon (Ekrana "D5 -> D8" yazdırmak için)
        public string Notation { get; set; }
        public bool IsCapture { get; set; } //Bu hamlede taş yendi mi?

        public string BoardSnapshot { get; set; } //Hamle sonrası tahtanın FEN benzeri string gösterimi
    }
}
