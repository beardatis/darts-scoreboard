using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DartsScoreboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGamePlayerTurnOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TurnOrder",
                table: "GamePlayers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TurnOrder",
                table: "GamePlayers");
        }
    }
}
