using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Greenhouse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedUnassignedDevicesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "unassigned_devices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unassigned_devices", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "unassigned_devices");
        }
    }
}
