namespace DartsScoreboard.Application.DTOs.Games;

public class GamePlayerResponse
{
    public Guid GamePlayerId { get; set; }

    public Guid PlayerId { get; set; }

    public string PlayerName { get; set; } = string.Empty;

    public int StartingScore { get; set; }

    public int RemainingScore { get; set; }

    public bool IsActiveInGame { get; set; }
    
    public string? CheckoutSuggestion { get; set; }
}