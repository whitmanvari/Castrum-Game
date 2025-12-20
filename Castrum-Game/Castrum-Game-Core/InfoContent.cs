using Castrum_Game_Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Castrum_Game_Core
{
    public class InfoContent: BaseEntity
    {
        [Required]
        public string Title { get; set; } //Örneğin: Tutuklama hareketi

        [Required]
        public string TextContent { get; set; } //İçerik Metni

        public string? ImageUrl { get; set; } //Opsiyonel Görsel Linki
        public ContentType Type { get; set; } //Kural mı? Strateji mi? Hakkında mı?
        public int OrderIndex { get; set; } //Sıralama



    }
}
