using ContractManagement.Api.Enums;
using ContractManagement.Api.Services;
using Xunit;

namespace ContractManagement.Tests;

public class ContractLifecycleTests
{
    private readonly ContractService _service;

    public ContractLifecycleTests()
    {
        _service = new ContractService();
    }

    [Theory]
    [InlineData(ContractStatus.Created, ContractStatus.Approved, true)]
    [InlineData(ContractStatus.Created, ContractStatus.Revoked, true)]
    [InlineData(ContractStatus.Approved, ContractStatus.Sent, true)]
    [InlineData(ContractStatus.Sent, ContractStatus.Signed, true)]
    [InlineData(ContractStatus.Signed, ContractStatus.Locked, true)]
    [InlineData(ContractStatus.Locked, ContractStatus.Revoked, false)]
    [InlineData(ContractStatus.Revoked, ContractStatus.Created, false)]
    [InlineData(ContractStatus.Created, ContractStatus.Locked, false)]
    public void IsValidTransition_ValidatesCorrectly(ContractStatus current, ContractStatus next, bool expected)
    {
        // Act
        var result = _service.IsValidTransition(current, next);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("Admin", ContractStatus.Approved, true)]
    [InlineData("Admin", ContractStatus.Locked, true)]
    [InlineData("Approver", ContractStatus.Approved, true)]
    [InlineData("Approver", ContractStatus.Signed, false)]
    [InlineData("Signer", ContractStatus.Signed, true)]
    [InlineData("Signer", ContractStatus.Approved, false)]
    [InlineData("Guest", ContractStatus.Approved, false)]
    public void IsRoleAuthorizedForTransition_ValidatesPermissions(string role, ContractStatus next, bool expected)
    {
        // Act
        var result = _service.IsRoleAuthorizedForTransition(role, next);

        // Assert
        Assert.Equal(expected, result);
    }
}
