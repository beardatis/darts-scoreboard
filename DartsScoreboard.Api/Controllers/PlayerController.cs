using System.Security.Claims;
using DartsScoreboard.Application.DTOs.Players;
using DartsScoreboard.Domain.Entities;
using DartsScoreboard.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsScoreboard.Api.Controllers;

[ApiController]
[Route("api/players")]
[Authorize]
public class PlayersController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public PlayersController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<PlayerResponse>>> GetPlayers()
    {
        Guid currentUserId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        bool isAdmin = User.IsInRole("Admin");

        IQueryable<Player> query = _dbContext.Players
            .Where(player => player.IsActive);

        if (!isAdmin)
        {
            query = query.Where(player =>
                player.CreatedByUserId == currentUserId);
        }

        List<PlayerResponse> players = await query
            .OrderBy(player => player.Name)
            .Select(player => new PlayerResponse
            {
                Id = player.Id,
                Name = player.Name,
                IsActive = player.IsActive
            })
            .ToListAsync();

        return Ok(players);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlayer(CreatePlayerRequest request)
    {
        Guid currentUserId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        string normalizedName = request.Name.Trim();

        bool exists = await _dbContext.Players
            .AnyAsync(player =>
                player.CreatedByUserId == currentUserId &&
                player.Name.ToLower() == normalizedName.ToLower());

        if (exists)
        {
            return BadRequest("Player already exists.");
        }

        Player player = new Player
        {
            Name = normalizedName,
            CreatedByUserId = currentUserId
        };

        _dbContext.Players.Add(player);

        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePlayer(
        Guid id,
        UpdatePlayerRequest request)
    {
        Guid currentUserId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        bool isAdmin = User.IsInRole("Admin");

        Player? player = await _dbContext.Players
            .FirstOrDefaultAsync(player => player.Id == id);

        if (player is null)
        {
            return NotFound();
        }

        if (!isAdmin && player.CreatedByUserId != currentUserId)
        {
            return Forbid();
        }

        player.Name = request.Name.Trim();

        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPatch("{id:guid}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeactivatePlayer(Guid id)
    {
        Player? player = await _dbContext.Players
            .FirstOrDefaultAsync(player => player.Id == id);

        if (player is null)
        {
            return NotFound();
        }

        player.IsActive = false;

        await _dbContext.SaveChangesAsync();

        return Ok();
    }
}