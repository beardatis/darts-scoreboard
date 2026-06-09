using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DartsScoreboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueThrowPerPlayerRound : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ThrowRecords_GameId",
                table: "ThrowRecords");

            migrationBuilder.CreateIndex(
                name: "IX_ThrowRecords_GameId_GamePlayerId_RoundNumber",
                table: "ThrowRecords",
                columns: new[] { "GameId", "GamePlayerId", "RoundNumber" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ThrowRecords_GameId_GamePlayerId_RoundNumber",
                table: "ThrowRecords");

            migrationBuilder.CreateIndex(
                name: "IX_ThrowRecords_GameId",
                table: "ThrowRecords",
                column: "GameId");
        }
    }
}
