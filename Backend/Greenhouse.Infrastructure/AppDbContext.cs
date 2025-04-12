using Greenhouse.Domain;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<RequestCount> RequestCounts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RequestCount>(entity =>
        {
            entity.ToTable("request_counts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Count).IsRequired();
        });


        modelBuilder.Entity<Example>(entity =>
        {
            entity.ToTable("example");
            entity.HasKey(e => e.Id);
        });
    }
}