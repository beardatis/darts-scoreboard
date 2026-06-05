using DartsScoreboard.Application.Interfaces;
using DartsScoreboard.Application.Settings;
using DartsScoreboard.Domain.Entities;
using DartsScoreboard.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DartsScoreboard.Infrastructure.Data.Seed;

public class AdminSeeder
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly AdminSeedSettings _settings;

    public AdminSeeder(
        AppDbContext dbContext,
        IPasswordHasher passwordHasher,
        IOptions<AdminSeedSettings> options)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _settings = options.Value;
    }

    public async Task SeedAsync()
    {
        bool adminExists = await _dbContext.Users
            .AnyAsync(user => user.Role == UserRole.Admin);

        if (adminExists)
        {
            return;
        }

        User admin = new User
        {
            Username = _settings.Username,
            Email = _settings.Email,
            PasswordHash = _passwordHasher.Hash(_settings.Password),
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(admin);

        await _dbContext.SaveChangesAsync();
    }
}