using DartsScoreboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DartsScoreboard.Infrastructure.Data.Configurations;

public class GamePlayerConfiguration : IEntityTypeConfiguration<GamePlayer>
{
    public void Configure(EntityTypeBuilder<GamePlayer> builder)
    {
        builder.ToTable("GamePlayers");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Game)
            .WithMany(x => x.GamePlayers)
            .HasForeignKey(x => x.GameId);

        builder.HasOne(x => x.Player)
            .WithMany()
            .HasForeignKey(x => x.PlayerId);
    }
}