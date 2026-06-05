namespace DartsScoreboard.Application.Interfaces;

public interface IEmailSender
{
    Task SendPasswordResetEmailAsync(
        string email,
        string resetToken);
    
    Task SendRegistrationWelcomeEmailAsync(
        string email,
        string username);
}