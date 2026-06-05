using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DartsScoreboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDartsToThrowRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Dart1",
                table: "ThrowRecords",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Dart2",
                table: "ThrowRecords",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Dart3",
                table: "ThrowRecords",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsBust",
                table: "ThrowRecords",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dart1",
                table: "ThrowRecords");

            migrationBuilder.DropColumn(
                name: "Dart2",
                table: "ThrowRecords");

            migrationBuilder.DropColumn(
                name: "Dart3",
                table: "ThrowRecords");

            migrationBuilder.DropColumn(
                name: "IsBust",
                table: "ThrowRecords");
        }
    }
}
