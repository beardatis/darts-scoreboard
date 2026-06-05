using DartsScoreboard.Domain.Enums;

namespace DartsScoreboard.Application.DTOs.Admin;

public class AdminUserResponse
{
    public Guid Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}