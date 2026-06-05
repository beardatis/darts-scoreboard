using DartsScoreboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DartsScoreboard.Infrastructure.Data.Configurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.ToTable("Games");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.GameType)
            .IsRequired();

        builder.Property(x => x.Status)
            .IsRequired();
    }
}