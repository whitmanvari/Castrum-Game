using Castrum_Game_Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Castrum_Game_Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {        
        }
        //Tablolar
        public DbSet<GameMatch> GameMatches { get; set; }
        public DbSet<GameMove> GameMoves { get; set; }
        public DbSet<InfoContent> InfoContents { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // İlişki Tanımı: Bir Maç silinirse, Hamleleri de silinsin (Cascade Delete)
            modelBuilder.Entity<GameMatch>()
                .HasMany(m => m.Moves)
                .WithOne(g => g.GameMatch)
                .HasForeignKey(g => g.GameMatchId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
