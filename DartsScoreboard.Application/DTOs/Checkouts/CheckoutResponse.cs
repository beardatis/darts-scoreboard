namespace DartsScoreboard.Application.DTOs.Checkouts;

public class CheckoutResponse
{
    public int RemainingScore { get; set; }

    public bool IsCheckoutPossible { get; set; }

    public string? Suggestion { get; set; }
}