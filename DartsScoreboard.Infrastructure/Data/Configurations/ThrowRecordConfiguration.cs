using DartsScoreboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DartsScoreboard.Infrastructure.Data.Configurations;

public class ThrowRecordConfiguration : IEntityTypeConfiguration<ThrowRecord>
{
    public void Configure(EntityTypeBuilder<ThrowRecord> builder)
    {
        builder.ToTable("ThrowRecords");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Game)
            .WithMany()
            .HasForeignKey(x => x.GameId);

        builder.HasOne(x => x.GamePlayer)
            .WithMany()
            .HasForeignKey(x => x.GamePlayerId);
        
        builder.HasIndex(throwRecord => new
            {
                throwRecord.GameId,
                throwRecord.GamePlayerId,
                throwRecord.RoundNumber
            })
            .IsUnique();
    }
}