using DartsScoreboard.Domain.Enums;

namespace DartsScoreboard.Application.DTOs.Games;

public class GameResponse
{
    public Guid Id { get; set; }

    public GameType GameType { get; set; }

    public GameStatus Status { get; set; }

    public Guid CreatedByUserId { get; set; }

    public Guid? WinnerPlayerId { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public List<GamePlayerResponse> Players { get; set; } = new List<GamePlayerResponse>();
}