using ContractManagement.Api.Enums;

namespace ContractManagement.Api.Interfaces;

public interface IContractService
{
    bool IsValidTransition(ContractStatus current, ContractStatus next);
    bool IsRoleAuthorizedForTransition(string role, ContractStatus next);
}
