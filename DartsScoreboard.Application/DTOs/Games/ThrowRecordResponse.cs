namespace DartsScoreboard.Application.DTOs.Games;

public class ThrowRecordResponse
{
    public Guid Id { get; set; }

    public Guid GameId { get; set; }

    public Guid GamePlayerId { get; set; }

    public string PlayerName { get; set; } = string.Empty;

    public int Dart1 { get; set; }

    public int Dart2 { get; set; }

    public int Dart3 { get; set; }

    public int Score { get; set; }

    public int RemainingAfterThrow { get; set; }

    public int RoundNumber { get; set; }

    public bool IsBust { get; set; }

    public DateTime CreatedAt { get; set; }
}