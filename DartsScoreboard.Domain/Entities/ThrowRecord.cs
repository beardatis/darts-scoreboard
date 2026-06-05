namespace DartsScoreboard.Domain.Entities;

public class ThrowRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid GameId { get; set; }

    public Guid GamePlayerId { get; set; }

    public int Score { get; set; }

    public int RemainingAfterThrow { get; set; }

    public int RoundNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Game? Game { get; set; }

    public GamePlayer? GamePlayer { get; set; }
    
    public int Dart1 { get; set; }

    public int Dart2 { get; set; }

    public int Dart3 { get; set; }

    public bool IsBust { get; set; }
    
    public int ThrowTotal =>
        Dart1 + Dart2 + Dart3;
}