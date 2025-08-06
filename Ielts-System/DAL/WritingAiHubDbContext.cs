
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using BusinessObject;
namespace DAL;

public partial class WritingAiHubDbContext : DbContext
{
    public WritingAiHubDbContext()
    {
    }

    public WritingAiHubDbContext(DbContextOptions<WritingAiHubDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(GetConnectionString());
    private string GetConnectionString()
    {
        IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true).Build();
        return configuration["ConnectionStrings:DefaultConnection"];
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.Property(e => e.Id).HasColumnName("id").UseIdentityAlwaysColumn(); ; 
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasMaxLength(10)
                .HasColumnName("role");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .HasColumnName("username");
            entity.Property(e => e.CreatedAt)
           .HasColumnName("createdat")
           .HasColumnType("timestamp with time zone");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
