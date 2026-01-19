using Microsoft.EntityFrameworkCore;
using ContractManagement.Api.Models;

namespace ContractManagement.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Blueprint> Blueprints { get; set; }
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<ContractHistory> ContractHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blueprint>(entity => {
            entity.ToTable("blueprints");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Fields).HasColumnName("fields").HasColumnType("jsonb");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<Contract>(entity => {
            entity.ToTable("contracts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BlueprintId).HasColumnName("blueprint_id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Status).HasColumnName("status").HasConversion<string>();
            entity.Property(e => e.FieldData).HasColumnName("field_data").HasColumnType("jsonb");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(c => c.Blueprint)
                .WithMany()
                .HasForeignKey(c => c.BlueprintId);
        });

        modelBuilder.Entity<ContractHistory>(entity => {
            entity.ToTable("contract_history");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ContractId).HasColumnName("contract_id");
            entity.Property(e => e.FromStatus).HasColumnName("from_status").HasConversion<string>();
            entity.Property(e => e.ToStatus).HasColumnName("to_status").HasConversion<string>();
            entity.Property(e => e.TransitionedAt).HasColumnName("transitioned_at");
            entity.Property(e => e.ActionBy).HasColumnName("action_by");

            entity.HasOne(ch => ch.Contract)
                .WithMany()
                .HasForeignKey(ch => ch.ContractId);
        });
            
        base.OnModelCreating(modelBuilder);
    }
}
