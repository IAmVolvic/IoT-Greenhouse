using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Greenhouse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PreferencesStructureChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Passwordhash",
                table: "preferences");

            migrationBuilder.DropColumn(
                name: "SSID",
                table: "preferences");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Passwordhash",
                table: "preferences",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SSID",
                table: "preferences",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
