using System.Security.Claims;
using DartsScoreboard.Application.Checkouts;
using DartsScoreboard.Application.DTOs.Games;
using DartsScoreboard.Domain.Entities;
using DartsScoreboard.Domain.Enums;
using DartsScoreboard.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsScoreboard.Api.Controllers;

[ApiController]
[Route("api/games")]
[Authorize]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public GamesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateGame(
        CreateGameRequest request)
    {
        Guid currentUserId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        List<Player> players = await _dbContext.Players
            .Where(player =>
                request.PlayerIds.Contains(player.Id) &&
                player.CreatedByUserId == currentUserId &&
                player.IsActive)
            .ToListAsync();

        if (players.Count != request.PlayerIds.Count)
        {
            return BadRequest(
                "One or more players are invalid."
            );
        }

        if (request.GameType != GameType.X01_301 &&
            request.GameType != GameType.X01_501)
        {
            return BadRequest("Unsupported game type.");
        }

        int startingScore = request.GameType == GameType.X01_301
            ? 301
            : 501;

        Game game = new Game
        {
            GameType = request.GameType,
            Status = GameStatus.Active,
            CreatedByUserId = currentUserId,
            StartedAt = DateTime.UtcNow
        };

        _dbContext.Games.Add(game);

        for (int index = 0; index < request.PlayerIds.Count; index++)
        {
            Guid playerId = request.PlayerIds[index];

            Player? player = players
                .FirstOrDefault(player => player.Id == playerId);

            if (player is null)
            {
                return BadRequest(
                    "One or more players are invalid."
                );
            }

            GamePlayer gamePlayer = new GamePlayer
            {
                GameId = game.Id,
                PlayerId = player.Id,
                StartingScore = startingScore,
                RemainingScore = startingScore,
                TurnOrder = index
            };

            _dbContext.GamePlayers.Add(gamePlayer);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(game.Id);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GameResponse>> GetGame(
        Guid id)
    {
        Guid currentUserId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        bool isAdmin = User.IsInRole("Admin");


    Game? game = await _dbContext.Games
            .Include(game => game.GamePlayers)
            .ThenInclude(gamePlayer => gamePlayer.Player)
            .FirstOrDefaultAsync(game => game.Id == id);
        if (game is null)
    {
        return NotFound();
    }

    if (!isAdmin &&
    game.CreatedByUserId != currentUserId)
    {
        return Forbid();
    }

    GameResponse response = new GameResponse
        {
            Id = game.Id,
            GameType = game.GameType,
            Status = game.Status,
            CreatedByUserId = game.CreatedByUserId,
            WinnerPlayerId = game.WinnerPlayerId,
            StartedAt = game.StartedAt,
            FinishedAt = game.FinishedAt
        };
        foreach (GamePlayer gamePlayer in game.GamePlayers
                     .OrderBy(gamePlayer => gamePlayer.TurnOrder))
        {
            string? checkoutSuggestion = null;

            if (gamePlayer.RemainingScore <= 170 &&
                gamePlayer.RemainingScore >= 2)
            {
                CheckoutTable.Checkouts.TryGetValue(
                    gamePlayer.RemainingScore,
                    out checkoutSuggestion);
            }

            response.Players.Add(
                new GamePlayerResponse
                {
                    GamePlayerId = gamePlayer.Id,
                    PlayerId = gamePlayer.PlayerId,
                    PlayerName = gamePlayer.Player?.Name ?? "",
                    StartingScore = gamePlayer.StartingScore,
                    RemainingScore = gamePlayer.RemainingScore,
                    IsActiveInGame = gamePlayer.IsActiveInGame,
                    CheckoutSuggestion = checkoutSuggestion
                });
        }

return Ok(response);

}

[HttpPost("{id:guid}/throw")]
public async Task<IActionResult> RecordThrow(
    Guid id,
    RecordThrowRequest request)
{
    Guid currentUserId = Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    Game? game = await _dbContext.Games
        .FirstOrDefaultAsync(game => game.Id == id);

    if (game is null)
    {
        return NotFound();
    }

    bool isAdmin = User.IsInRole("Admin");

    if (!isAdmin && game.CreatedByUserId != currentUserId)
    {
        return Forbid();
    }

    if (game.Status != GameStatus.Active)
    {
        return BadRequest("Game is not active.");
    }

    GamePlayer? gamePlayer = await _dbContext.GamePlayers
        .FirstOrDefaultAsync(gamePlayer =>
            gamePlayer.GameId == id &&
            gamePlayer.PlayerId == request.PlayerId &&
            gamePlayer.IsActiveInGame);

    if (gamePlayer is null)
    {
        return BadRequest("Player is not part of this game.");
    }

    int throwScore = request.Dart1 + request.Dart2 + request.Dart3;
    int newRemainingScore = gamePlayer.RemainingScore - throwScore;

    bool lastDartIsDoubleOut = false;

    if (request.Dart3 > 0)
    {
        lastDartIsDoubleOut = request.Dart3IsDoubleOut;
    }
    else if (request.Dart2 > 0)
    {
        lastDartIsDoubleOut = request.Dart2IsDoubleOut;
    }
    else if (request.Dart1 > 0)
    {
        lastDartIsDoubleOut = request.Dart1IsDoubleOut;
    }

    bool isBust =
        newRemainingScore < 0 ||
        newRemainingScore == 1 ||
        (newRemainingScore == 0 && !lastDartIsDoubleOut);
    
    int remainingAfterThrow = isBust
        ? gamePlayer.RemainingScore
        : newRemainingScore;

    if (!isBust)
    {
        gamePlayer.RemainingScore = newRemainingScore;
    }

    if (!isBust && remainingAfterThrow == 0)
    {
        game.Status = GameStatus.Finished;
        game.WinnerPlayerId = gamePlayer.PlayerId;
        game.FinishedAt = DateTime.UtcNow;
    }

    int nextRoundNumber = await _dbContext.ThrowRecords
        .Where(throwRecord =>
            throwRecord.GamePlayerId == gamePlayer.Id)
        .CountAsync() + 1;

    ThrowRecord throwRecord = new ThrowRecord
    {
        GameId = game.Id,
        GamePlayerId = gamePlayer.Id,
        Dart1 = request.Dart1,
        Dart2 = request.Dart2,
        Dart3 = request.Dart3,
        Score = throwScore,
        RemainingAfterThrow = remainingAfterThrow,
        RoundNumber = nextRoundNumber,
        IsBust = isBust
    };

    _dbContext.ThrowRecords.Add(throwRecord);

    await _dbContext.SaveChangesAsync();

    //return Ok();
    string? checkoutSuggestion = null;

    if (gamePlayer.RemainingScore <= 170 &&
        gamePlayer.RemainingScore >= 2)
    {
        CheckoutTable.Checkouts.TryGetValue(
            gamePlayer.RemainingScore,
            out checkoutSuggestion);
    }

    RecordThrowResponse response = new RecordThrowResponse
    {
        GameId = game.Id,
        PlayerId = gamePlayer.PlayerId,
        Dart1 = request.Dart1,
        Dart2 = request.Dart2,
        Dart3 = request.Dart3,
        Score = throwScore,
        RemainingScore = gamePlayer.RemainingScore,
        IsBust = isBust,
        IsGameFinished = game.Status == GameStatus.Finished,
        WinnerPlayerId = game.WinnerPlayerId,
        CheckoutSuggestion = checkoutSuggestion
    };

    return Ok(response);
}

[HttpGet("{id:guid}/throws")]
public async Task<ActionResult<List<ThrowRecordResponse>>> GetThrows(
    Guid id)
{
    Guid currentUserId = Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    bool isAdmin = User.IsInRole("Admin");

    Game? game = await _dbContext.Games
        .FirstOrDefaultAsync(game => game.Id == id);

    if (game is null)
    {
        return NotFound();
    }

    if (!isAdmin && game.CreatedByUserId != currentUserId)
    {
        return Forbid();
    }

    List<ThrowRecordResponse> throws = await _dbContext.ThrowRecords
        .Where(throwRecord => throwRecord.GameId == id)
        .Include(throwRecord => throwRecord.GamePlayer)
        .ThenInclude(gamePlayer => gamePlayer!.Player)
        .OrderBy(throwRecord => throwRecord.RoundNumber)
        .ThenBy(throwRecord => throwRecord.GamePlayer!.TurnOrder)
        .ThenBy(throwRecord => throwRecord.CreatedAt)
        .Select(throwRecord => new ThrowRecordResponse
        {
            Id = throwRecord.Id,
            GameId = throwRecord.GameId,
            GamePlayerId = throwRecord.GamePlayerId,
            PlayerName = throwRecord.GamePlayer!.Player!.Name,
            Dart1 = throwRecord.Dart1,
            Dart2 = throwRecord.Dart2,
            Dart3 = throwRecord.Dart3,
            Score = throwRecord.Score,
            RemainingAfterThrow = throwRecord.RemainingAfterThrow,
            RoundNumber = throwRecord.RoundNumber,
            IsBust = throwRecord.IsBust,
            CreatedAt = throwRecord.CreatedAt
        })
        .ToListAsync();

    return Ok(throws);
}

[HttpGet]
public async Task<ActionResult<List<GameListItemResponse>>> GetGames()
{
    Guid currentUserId = Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    bool isAdmin = User.IsInRole("Admin");

    IQueryable<Game> query = _dbContext.Games;

    if (!isAdmin)
    {
        query = query.Where(game =>
            game.CreatedByUserId == currentUserId);
    }

    List<GameListItemResponse> games = await query
        .OrderByDescending(game => game.StartedAt)
        .Select(game => new GameListItemResponse
        {
            Id = game.Id,
            GameType = game.GameType,
            Status = game.Status,
            WinnerPlayerId = game.WinnerPlayerId,
            StartedAt = game.StartedAt,
            FinishedAt = game.FinishedAt
        })
        .ToListAsync();

    return Ok(games);
}
}