using System.ComponentModel.DataAnnotations;

namespace ContractManagement.Api.Models;

public class Blueprint
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    [Required]
    public string Fields { get; set; } = "[]";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
