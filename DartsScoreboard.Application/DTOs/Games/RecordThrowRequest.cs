namespace DartsScoreboard.Application.DTOs.Games;

public class RecordThrowRequest
{
    public Guid PlayerId { get; set; }

    public int Dart1 { get; set; }

    public int Dart2 { get; set; }

    public int Dart3 { get; set; }
    
    public bool Dart1IsDoubleOut { get; set; }
    public bool Dart2IsDoubleOut { get; set; }
    public bool Dart3IsDoubleOut { get; set; }
}