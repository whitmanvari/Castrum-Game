using Castrum_Game_Core.DTOs;
using Castrum_Game_Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Castrum_Game_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;
        public GamesController(IGameService gameService)
        {
            _gameService = gameService;
        }
        // Yeni Oyun Başlatma 
        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newGame = await _gameService.CreateGameAsync(request);

            // 201 Created döner ve oluşturulan oyunun bilgisini verir
            return CreatedAtAction(nameof(GetGame), new { id = newGame.Id }, newGame);
        }

        // Tüm Oyunları Listeleme 
        [HttpGet]
        public async Task<IActionResult> GetAllGames()
        {
            var games = await _gameService.GetAllGamesAsync();
            return Ok(games);
        }

        // Tek Bir Oyunun Detayını Getirme 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGame(int id)
        {
            var game = await _gameService.GetGameByIdAsync(id);
            if (game == null)
                return NotFound("Oyun bulunamadı.");

            return Ok(game);
        }

        [HttpPost("{id}/move")]
        public async Task<IActionResult> MakeMove(int id, [FromBody] CreateMoveDto request)
        {
            // ID Güvenliği
            request.GameId = id;

            try
            {
                var result = await _gameService.MakeMoveAsync(request);
                return Ok(new { message = "Hamle başarılı", data = result });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

