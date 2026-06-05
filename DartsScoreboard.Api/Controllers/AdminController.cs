using DartsScoreboard.Application.DTOs.Admin;
using DartsScoreboard.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsScoreboard.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public AdminController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<AdminUserResponse>>> GetUsers()
    {
        List<AdminUserResponse> users = await _dbContext.Users
            .OrderBy(user => user.Username)
            .Select(user => new AdminUserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("players")]
    public async Task<ActionResult<List<AdminPlayerResponse>>> GetPlayers()
    {
        List<AdminPlayerResponse> players = await _dbContext.Players
            .OrderBy(player => player.Name)
            .Select(player => new AdminPlayerResponse
            {
                Id = player.Id,
                Name = player.Name,
                IsActive = player.IsActive,
                CreatedByUserId = player.CreatedByUserId,
                CreatedAt = player.CreatedAt
            })
            .ToListAsync();

        return Ok(players);
    }

    [HttpGet("games")]
    public async Task<ActionResult<List<AdminGameResponse>>> GetGames()
    {
        List<AdminGameResponse> games = await _dbContext.Games
            .OrderByDescending(game => game.StartedAt)
            .Select(game => new AdminGameResponse
            {
                Id = game.Id,
                GameType = game.GameType,
                Status = game.Status,
                CreatedByUserId = game.CreatedByUserId,
                WinnerPlayerId = game.WinnerPlayerId,
                StartedAt = game.StartedAt,
                FinishedAt = game.FinishedAt
            })
            .ToListAsync();

        return Ok(games);
    }
}