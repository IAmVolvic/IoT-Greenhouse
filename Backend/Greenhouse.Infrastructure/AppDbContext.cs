using Greenhouse.Domain;
using Greenhouse.Domain.DatabaseDtos;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<RequestCount> RequestCounts { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<Log> Logs { get; set; }
    public DbSet<Preferences> Preferences { get; set; }
    public DbSet<UnassignedDevice> UnassignedDevices { get; set; }
    public DbSet<FeatureFlag> FeatureFlag { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // RequestCount table
        modelBuilder.Entity<RequestCount>(entity =>
        {
            entity.ToTable("request_counts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Count).IsRequired();
        });

        // User table
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Passwordhash).IsRequired();
            entity.Property(e => e.Role).HasDefaultValue(UserRole.USER);
        });

        // Device table
        modelBuilder.Entity<Device>(entity =>
        {
            entity.ToTable("devices");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DeviceName).IsRequired();
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Logs table
        modelBuilder.Entity<Log>(entity =>
        {
            entity.ToTable("logs");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Unit).IsRequired();
            entity.Property(e => e.Value).IsRequired();
            entity.Property(e => e.Type).IsRequired();
            entity.Property(e => e.Date).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasOne<Device>()
                  .WithMany()
                  .HasForeignKey(l => l.DeviceId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Preferences table
        modelBuilder.Entity<Preferences>(entity =>
        {
            entity.ToTable("preferences");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SensorInterval).IsRequired();
            entity.HasOne<Device>()
                .WithMany()
                .HasForeignKey(p => p.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UnassignedDevice>(entity =>
        {
            entity.ToTable("unassigned_devices"); // optional custom name
            entity.HasKey(e => e.Id);
        });
        
        modelBuilder.Entity<FeatureFlag>(entity =>
        {
            entity.ToTable("feature_flag");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .IsRequired();

            entity.Property(e => e.FlagName)
                .HasColumnName("flag_name")
                .HasMaxLength(100)
                .IsRequired();
            entity.HasIndex(e => e.FlagName).IsUnique();
            
            entity.Property(e => e.IsToggled)
                .HasColumnName("is_toggled")
                .IsRequired();
            
            // Seeding
            entity.HasData(new FeatureFlag
            {
                Id = Guid.Parse("8e5930c3-bb5f-4e3e-bfe6-f3c6d460a2c8"),
                FlagName = "feature_login",
                IsToggled = true
            });
            
            entity.HasData(new FeatureFlag
            {
                Id = Guid.Parse("3bd9d2e2-8a94-4d0a-8977-7e219ee91e64"),
                FlagName = "feature_signup",
                IsToggled = true
            });
        });
    }
}
