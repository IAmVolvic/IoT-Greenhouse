using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Greenhouse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FeatureFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "feature_flag",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    flag_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    is_toggled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_feature_flag", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_feature_flag_flag_name",
                table: "feature_flag",
                column: "flag_name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "feature_flag");
        }
    }
}
