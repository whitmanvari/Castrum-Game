using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Castrum_Game_Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameMatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AttackerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DefenderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Winner = table.Column<int>(type: "int", nullable: true),
                    TotalMoves = table.Column<int>(type: "int", nullable: false),
                    CurrentBoardState = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationSeconds = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameMatches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InfoContents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TextContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    OrderIndex = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InfoContents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameMoves",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameMatchId = table.Column<int>(type: "int", nullable: false),
                    MoveNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Player = table.Column<int>(type: "int", nullable: false),
                    FromRow = table.Column<int>(type: "int", nullable: false),
                    FromCol = table.Column<int>(type: "int", nullable: false),
                    ToRow = table.Column<int>(type: "int", nullable: false),
                    ToCol = table.Column<int>(type: "int", nullable: false),
                    Notation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCapture = table.Column<bool>(type: "bit", nullable: false),
                    BoardSnapshot = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameMoves", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameMoves_GameMatches_GameMatchId",
                        column: x => x.GameMatchId,
                        principalTable: "GameMatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameMoves_GameMatchId",
                table: "GameMoves",
                column: "GameMatchId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameMoves");

            migrationBuilder.DropTable(
                name: "InfoContents");

            migrationBuilder.DropTable(
                name: "GameMatches");
        }
    }
}
