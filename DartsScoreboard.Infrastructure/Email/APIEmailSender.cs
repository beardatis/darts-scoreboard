using System.Net.Http.Json;
using System.Text.Json.Serialization;
using DartsScoreboard.Application.Interfaces;
using DartsScoreboard.Application.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace DartsScoreboard.Infrastructure.Email;

public class APIEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public APIEmailSender(
        IOptions<EmailSettings> settings,
        IConfiguration configuration,
        HttpClient httpClient)
    {
        _settings = settings.Value;
        _configuration = configuration;
        _httpClient = httpClient;
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
        BrevoEmailRequest request = new()
        {
            Sender = new BrevoSender
            {
                Name = _settings.FromName,
                Email = _settings.From
            },
            To =
            [
                new BrevoRecipient
                {
                    Email = to
                }
            ],
            Subject = subject,
            TextContent = body
        };

        using HttpRequestMessage httpRequest = new(
            HttpMethod.Post,
            "https://api.brevo.com/v3/smtp/email");

        httpRequest.Headers.Add(
            "api-key",
            _settings.BrevoApiKey);

        httpRequest.Content =
            JsonContent.Create(request);

        using HttpResponseMessage response =
            await _httpClient.SendAsync(httpRequest);

        if (!response.IsSuccessStatusCode)
        {
            string responseBody =
                await response.Content.ReadAsStringAsync();

            throw new InvalidOperationException(
                $"Brevo email sending failed. Status: {(int)response.StatusCode}. Response: {responseBody}");
        }
    }

    private sealed class BrevoEmailRequest
    {
        [JsonPropertyName("sender")]
        public BrevoSender Sender { get; set; } = new();

        [JsonPropertyName("to")]
        public List<BrevoRecipient> To { get; set; } = [];

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("textContent")]
        public string TextContent { get; set; } = string.Empty;
    }

    private sealed class BrevoSender
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }

    private sealed class BrevoRecipient
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }
}