using DartsScoreboard.Application.Interfaces;
using DartsScoreboard.Application.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;

namespace DartsScoreboard.Infrastructure.Email;

public class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly IConfiguration _configuration;

    public SmtpEmailSender(
        IOptions<EmailSettings> settings,
        IConfiguration configuration)
    {
        _settings = settings.Value;
        _configuration = configuration;
    }

    public async Task SendRegistrationWelcomeEmailAsync(
        string email,
        string username)
    {
        string body = $"""
                       Szia {username}!

                       Üdvözlünk a Darts Scoreboard rendszerben!

                       Jó játékot kívánunk! 🎯

                       Darts Scoreboard
                       """;

        await SendAsync(
            email,
            "Üdvözlünk a Darts Scoreboard rendszerben",
            body);
    }

    public async Task SendPasswordResetEmailAsync(
        string email,
        string resetToken)
    {
        string frontendUrl =
            _configuration["Frontend:BaseUrl"]!;

        string resetLink =
            $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(resetToken)}&email={Uri.EscapeDataString(email)}";

        string body = $"""
                       Szia!

                       Jelszó-visszaállítást kezdeményeztél.

                       Az alábbi linkre kattintva új jelszót adhatsz meg:

                       {resetLink}

                       Ha nem te kérted ezt a műveletet,
                       hagyd figyelmen kívül ezt az emailt.

                       Darts Scoreboard
                       """;

        await SendAsync(
            email,
            "Jelszó visszaállítás",
            body);
    }
    private async Task SendAsync(
        string to,
        string subject,
        string body)
    {
        MimeMessage message = new();

        message.From.Add(
            new MailboxAddress(
                _settings.FromName,
                _settings.From));

        message.To.Add(
            MailboxAddress.Parse(to));

        message.Subject = subject;

        message.Body = new TextPart("plain")
        {
            Text = body
        };

        using SmtpClient client = new();

        client.Timeout = 10000;

#if DEBUG
        client.CheckCertificateRevocation = false;
#endif

        using CancellationTokenSource cancellationTokenSource =
            new(TimeSpan.FromSeconds(10));
        
        Console.WriteLine(
            $"SMTP Connect start: {_settings.Host}:{_settings.Port}");
        
        await client.ConnectAsync(
            _settings.Host,
            _settings.Port,
            SecureSocketOptions.Auto,
            cancellationTokenSource.Token);
        
        Console.WriteLine("SMTP Connect OK");

        Console.WriteLine("SMTP Auth start");
        
        await client.AuthenticateAsync(
            _settings.Username,
            _settings.Password,
            cancellationTokenSource.Token);
        
        Console.WriteLine("SMTP Auth OK");

        Console.WriteLine("SMTP Send start");

        await client.SendAsync(
            message,
            cancellationTokenSource.Token);
        
        Console.WriteLine("SMTP Send OK");

        await client.DisconnectAsync(
            true,
            cancellationTokenSource.Token);
    }
    // private async Task SendAsync(
    //     string to,
    //     string subject,
    //     string body)
    // {
    //     MimeMessage message = new();
    //
    //     message.From.Add(
    //         new MailboxAddress(
    //             _settings.FromName,
    //             _settings.From));
    //
    //     message.To.Add(
    //         MailboxAddress.Parse(to));
    //
    //     message.Subject = subject;
    //
    //     message.Body = new TextPart("plain")
    //     {
    //         Text = body
    //     };
    //
    //     using SmtpClient client = new();
    //
    //     await client.ConnectAsync(
    //         _settings.Host,
    //         _settings.Port,
    //         SecureSocketOptions.StartTls);
    //
    //     await client.AuthenticateAsync(
    //         _settings.Username,
    //         _settings.Password);
    //
    //     await client.SendAsync(message);
    //
    //     await client.DisconnectAsync(true);
    // }
}