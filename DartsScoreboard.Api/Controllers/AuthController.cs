using DartsScoreboard.Application.Interfaces;
using DartsScoreboard.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using DartsScoreboard.Application.DTOs.Auth;
using DartsScoreboard.Domain.Entities;
using DartsScoreboard.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using System.Text;

namespace DartsScoreboard.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailSender _emailSender;

    public AuthController(
        AppDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        IEmailSender emailSender)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _emailSender = emailSender;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("All fields are required.");
        }
        if (!Regex.IsMatch(
                request.Email,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            return BadRequest("Invalid email address.");
        }
        if (request.Password.Length < 6)
        {
            return BadRequest("Password must be at least 6 characters.");
        }
        bool emailExists = await _dbContext.Users
            .AnyAsync(x => x.Email.Trim().ToLower() == request.Email.Trim().ToLower());

        if (emailExists)
        {
            return BadRequest("Email already exists.");
        }

        bool usernameExists = await _dbContext.Users
            .AnyAsync(x => x.Username.Trim().ToLower() == request.Username.Trim().ToLower());

        if (usernameExists)
        {
            return BadRequest("Username already exists.");
        }

        User user = new User
        {
            Username = request.Username.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = UserRole.User
        };

        _dbContext.Users.Add(user);

        await _dbContext.SaveChangesAsync();
        try
        {
            await _emailSender.SendRegistrationWelcomeEmailAsync(
                user.Email,
                user.Username);
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"Registration welcome email failed for {user.Email}: {ex.Message}");
        }

        return Ok();
    }
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request)
    {
        User? user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user is null)
        {
            return Unauthorized();
        }

        bool validPassword = _passwordHasher.Verify(
            request.Password,
            user.PasswordHash);

        if (!validPassword)
        {
            return Unauthorized();
        }

        string token = _jwtTokenService.GenerateToken(user);

        LoginResponse response = new LoginResponse
        {
            Token = token,
            Username = user.Username,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        };

        return Ok(response);
    }
    
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Ok();
        }

        string email = request.Email.Trim().ToLower();

        User? user = await _dbContext.Users
            .FirstOrDefaultAsync(user =>
                user.Email.ToLower() == email);

        if (user is null)
        {
            return Ok();
        }

        string resetTokenValue = GenerateResetToken();
        string resetTokenHash = HashResetToken(resetTokenValue);

        PasswordResetToken resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = resetTokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };

        _dbContext.PasswordResetTokens.Add(resetToken);

        await _dbContext.SaveChangesAsync();

        await _emailSender.SendPasswordResetEmailAsync(
            user.Email,
            resetTokenValue);

        return Ok();
    }
    
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Token) ||
            string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest("All fields are required.");
        }

        if (request.NewPassword.Length < 6)
        {
            return BadRequest("Password must be at least 6 characters.");
        }
        string email = request.Email.Trim().ToLower();

        User? user = await _dbContext.Users
            .FirstOrDefaultAsync(user =>
                user.Email.ToLower() == email);

        if (user is null)
        {
            return NotFound("User not found.");
        }

        string requestTokenHash =
            HashResetToken(request.Token);

        PasswordResetToken? resetToken = await _dbContext
            .PasswordResetTokens
            .FirstOrDefaultAsync(token =>
                token.TokenHash == requestTokenHash &&
                token.UserId == user.Id);

        if (resetToken is null)
        {
            return BadRequest("Invalid token.");
        }

        if (resetToken.UsedAt is not null)
        {
            return BadRequest("Token already used.");
        }

        if (resetToken.ExpiresAt < DateTime.UtcNow)
        {
            return BadRequest("Token expired.");
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);

        resetToken.UsedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok();
    }
    
    private static string GenerateResetToken()
    {
        return Convert.ToBase64String(
            RandomNumberGenerator.GetBytes(64));
    }

    private static string HashResetToken(string token)
    {
        return Convert.ToBase64String(
            SHA256.HashData(
                Encoding.UTF8.GetBytes(token)));
    }
}