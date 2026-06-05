namespace DartsScoreboard.Domain.Entities;

public class GamePlayer
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid GameId { get; set; }

    public Guid PlayerId { get; set; }

    public int StartingScore { get; set; }

    public int RemainingScore { get; set; }

    public bool IsActiveInGame { get; set; } = true;

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public DateTime? RemovedAt { get; set; }

    public Game? Game { get; set; }

    public Player? Player { get; set; }
    
    public int TurnOrder { get; set; }
}