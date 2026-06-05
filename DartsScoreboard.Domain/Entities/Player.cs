namespace DartsScoreboard.Domain.Entities;

public class Player
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Guid CreatedByUserId { get; set; }
}