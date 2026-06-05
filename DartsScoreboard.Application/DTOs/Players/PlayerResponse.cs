namespace DartsScoreboard.Application.DTOs.Players;

public class PlayerResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}