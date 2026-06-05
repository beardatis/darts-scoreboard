using DartsScoreboard.Domain.Entities;

namespace DartsScoreboard.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}