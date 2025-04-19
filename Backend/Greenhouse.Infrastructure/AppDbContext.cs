using Greenhouse.Application.Security;
using Greenhouse.Domain;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<RequestCount> RequestCounts { get; set; }
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RequestCount>(entity =>
        {
            entity.ToTable("request_counts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Count).IsRequired();
        });
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Passwordhash).IsRequired();
            entity.Property(e => e.Role).HasDefaultValue(UserRole.USER);
        });
    }
}