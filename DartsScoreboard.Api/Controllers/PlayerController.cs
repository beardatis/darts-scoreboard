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

        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            return BadRequest("Player name is required.");
        }

        Player? existingPlayer = await _dbContext.Players
            .FirstOrDefaultAsync(player =>
                player.CreatedByUserId == currentUserId &&
                player.Name.ToLower() == normalizedName.ToLower());

        if (existingPlayer is not null)
        {
            if (existingPlayer.IsActive)
            {
                return BadRequest("Player already exists.");
            }

            existingPlayer.IsActive = true;
            existingPlayer.Name = normalizedName;

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        Player player = new Player
        {
            Name = normalizedName,
            CreatedByUserId = currentUserId,
            IsActive = true
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

        string normalizedName = request.Name.Trim();

        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            return BadRequest("Player name is required.");
        }

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

        bool nameExists = await _dbContext.Players
            .AnyAsync(otherPlayer =>
                otherPlayer.Id != player.Id &&
                otherPlayer.CreatedByUserId == player.CreatedByUserId &&
                otherPlayer.Name.ToLower() == normalizedName.ToLower());

        if (nameExists)
        {
            return BadRequest("Player already exists.");
        }

        player.Name = normalizedName;

        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePlayer(Guid id)
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

        player.IsActive = false;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}