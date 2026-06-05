using DartsScoreboard.Domain.Enums;

namespace DartsScoreboard.Domain.Entities;

public class Game
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public GameType GameType { get; set; }

    public GameStatus Status { get; set; } = GameStatus.Active;

    public Guid CreatedByUserId { get; set; }

    public Guid? WinnerPlayerId { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? FinishedAt { get; set; }
    
    public ICollection<GamePlayer> GamePlayers { get; set; } = new List<GamePlayer>();
}