using ContractManagement.Api.Enums;

namespace ContractManagement.Api.Models;

public class ContractHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ContractId { get; set; }
    public Contract? Contract { get; set; }
    
    public ContractStatus? FromStatus { get; set; }
    public ContractStatus ToStatus { get; set; }
    public DateTime TransitionedAt { get; set; } = DateTime.UtcNow;
    public string? ActionBy { get; set; }
}
