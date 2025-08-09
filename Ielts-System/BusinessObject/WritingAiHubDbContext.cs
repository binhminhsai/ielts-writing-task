using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BusinessObject;

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

    public virtual DbSet<WritingTask1> WritingTask1s { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=69.62.74.196;Port=5434;Username=ielts_admin;Password=Dawnchu1024&ielts_admin;Database=writing_ai_hub_db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Createdat).HasColumnName("createdat");
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
        });

        modelBuilder.Entity<WritingTask1>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("writing_task1_pkey");

            entity.ToTable("writing_task1");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Answer).HasColumnName("answer");
            entity.Property(e => e.ImagePath).HasColumnName("image_path");
            entity.Property(e => e.Question)
                .HasMaxLength(50)
                .HasColumnName("question");
            entity.Property(e => e.Usersid).HasColumnName("usersid");

            entity.HasOne(d => d.Users).WithMany(p => p.WritingTask1s)
                .HasForeignKey(d => d.Usersid)
                .HasConstraintName("fk_usersid");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
