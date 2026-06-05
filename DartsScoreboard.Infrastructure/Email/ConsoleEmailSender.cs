using DartsScoreboard.Application.Interfaces;

namespace DartsScoreboard.Infrastructure.Email;

public class ConsoleEmailSender : IEmailSender
{
    public Task SendPasswordResetEmailAsync(
        string email,
        string resetToken)
    {
        Console.WriteLine("PASSWORD RESET EMAIL");
        Console.WriteLine($"To: {email}");
        Console.WriteLine($"Token: {resetToken}");

        return Task.CompletedTask;
    }
    
    public Task SendRegistrationWelcomeEmailAsync(
        string email,
        string username)
    {
        Console.WriteLine("REGISTRATION WELCOME EMAIL");
        Console.WriteLine($"To: {email}");
        Console.WriteLine($"Hello {username}, welcome to Darts Scoreboard!");

        return Task.CompletedTask;
    }
}