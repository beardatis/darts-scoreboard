namespace DartsScoreboard.Application.DTOs.Games;

public class RecordThrowResponse
{
    public Guid GameId { get; set; }

    public Guid PlayerId { get; set; }

    public int Dart1 { get; set; }

    public int Dart2 { get; set; }

    public int Dart3 { get; set; }

    public int Score { get; set; }

    public int RemainingScore { get; set; }

    public bool IsBust { get; set; }

    public bool IsGameFinished { get; set; }

    public Guid? WinnerPlayerId { get; set; }

    public string? CheckoutSuggestion { get; set; }
}