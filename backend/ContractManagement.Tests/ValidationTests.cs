using ContractManagement.Api.DTOs;
using ContractManagement.Api.Validators;
using ContractManagement.Api.Models;
using FluentValidation.TestHelper;
using Xunit;
using System.Text.Json.Nodes;

namespace ContractManagement.Tests;

public class ValidationTests
{
    private readonly CreateBlueprintDtoValidator _blueprintValidator;
    private readonly CreateContractDtoValidator _contractValidator;

    public ValidationTests()
    {
        _blueprintValidator = new CreateBlueprintDtoValidator();
        _contractValidator = new CreateContractDtoValidator();
    }

    [Fact]
    public void Blueprint_ShouldHaveError_WhenNameIsEmpty()
    {
        var model = new CreateBlueprintDto("", "Test", JsonNode.Parse("[]")!);
        var result = _blueprintValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Blueprint_ShouldHaveError_WhenFieldsAreEmpty()
    {
        // Name is valid, but fields are empty string or null? 
        // Our validator says RuleFor(x => x.Fields).NotEmpty()
        // For a JsonNode, NotEmpty might check if it's null or has content.
        var model = new CreateBlueprintDto("Valid Name", "Test", null!);
        var result = _blueprintValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Fields);
    }

    [Fact]
    public void Contract_ShouldHaveError_WhenBlueprintIdIsMissing()
    {
        var model = new CreateContractDto(Guid.Empty, "Test Contact", null);
        var result = _contractValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.BlueprintId);
    }

    [Fact]
    public void Contract_ShouldHaveError_WhenNameIsMissing()
    {
        var model = new CreateContractDto(Guid.NewGuid(), "", null);
        var result = _contractValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
}
