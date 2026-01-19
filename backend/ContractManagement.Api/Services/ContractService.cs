using ContractManagement.Api.Enums;
using ContractManagement.Api.Interfaces;

namespace ContractManagement.Api.Services;

public class ContractService : IContractService
{
    public bool IsValidTransition(ContractStatus current, ContractStatus next)
    {
        if (current == ContractStatus.Locked) return false;
        if (current == ContractStatus.Revoked) return false;

        return (current, next) switch
        {
            (ContractStatus.Created, ContractStatus.Approved) => true,
            (ContractStatus.Created, ContractStatus.Revoked) => true,
            (ContractStatus.Approved, ContractStatus.Sent) => true,
            (ContractStatus.Sent, ContractStatus.Signed) => true,
            (ContractStatus.Sent, ContractStatus.Revoked) => true,
            (ContractStatus.Signed, ContractStatus.Locked) => true,
            _ => false
        };
    }

    public bool IsRoleAuthorizedForTransition(string role, ContractStatus next)
    {
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return true;

        return (role.ToUpper(), next) switch
        {
            ("APPROVER", ContractStatus.Approved) => true,
            ("APPROVER", ContractStatus.Sent) => true,
            ("APPROVER", ContractStatus.Revoked) => true,
            ("SIGNER", ContractStatus.Signed) => true,
            _ => false
        };
    }
}
