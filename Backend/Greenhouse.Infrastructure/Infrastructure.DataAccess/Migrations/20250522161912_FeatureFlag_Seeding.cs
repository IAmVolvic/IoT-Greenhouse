using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Greenhouse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FeatureFlag_Seeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "feature_flag",
                columns: new[] { "id", "flag_name", "is_toggled" },
                values: new object[,]
                {
                    { new Guid("3bd9d2e2-8a94-4d0a-8977-7e219ee91e64"), "feature_signup", true },
                    { new Guid("8e5930c3-bb5f-4e3e-bfe6-f3c6d460a2c8"), "feature_login", true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "feature_flag",
                keyColumn: "id",
                keyValue: new Guid("3bd9d2e2-8a94-4d0a-8977-7e219ee91e64"));

            migrationBuilder.DeleteData(
                table: "feature_flag",
                keyColumn: "id",
                keyValue: new Guid("8e5930c3-bb5f-4e3e-bfe6-f3c6d460a2c8"));
        }
    }
}
