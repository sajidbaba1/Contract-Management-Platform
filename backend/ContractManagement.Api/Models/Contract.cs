using System.ComponentModel.DataAnnotations;
using ContractManagement.Api.Enums;

namespace ContractManagement.Api.Models;

public class Contract
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid BlueprintId { get; set; }
    public Blueprint? Blueprint { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public ContractStatus Status { get; set; } = ContractStatus.Created;
    
    public string? FieldData { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
