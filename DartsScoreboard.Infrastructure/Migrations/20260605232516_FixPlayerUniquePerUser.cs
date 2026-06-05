using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DartsScoreboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixPlayerUniquePerUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Players_Name",
                table: "Players");

            migrationBuilder.CreateIndex(
                name: "IX_Players_CreatedByUserId_Name",
                table: "Players",
                columns: new[] { "CreatedByUserId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Players_CreatedByUserId_Name",
                table: "Players");

            migrationBuilder.CreateIndex(
                name: "IX_Players_Name",
                table: "Players",
                column: "Name",
                unique: true);
        }
    }
}
