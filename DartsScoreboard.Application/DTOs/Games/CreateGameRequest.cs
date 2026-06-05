using DartsScoreboard.Domain.Enums;

namespace DartsScoreboard.Application.DTOs.Games;

public class CreateGameRequest
{
    public GameType GameType { get; set; }

    public List<Guid> PlayerIds { get; set; } = new List<Guid>();
}