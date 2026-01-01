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
        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            var result = await _gameService.GetLeaderboardAsync();
            return Ok(result);
        }

        [HttpPost("{id}/end")]
        public async Task<IActionResult> EndGame(int id, [FromBody] EndGameDto request)
        {
            request.GameId = id;
            try
            {
                await _gameService.EndGameAsync(request);
                return Ok(new { message = "Oyun sonlandırıldı ve kazanan kaydedildi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (string.IsNullOrEmpty(request.Username)) return BadRequest("İsim gerekli.");
            var user = await _gameService.LoginAsync(request.Username);
            return Ok(user);
        }
    }
}

