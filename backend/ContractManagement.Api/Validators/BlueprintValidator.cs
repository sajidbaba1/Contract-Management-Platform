using FluentValidation;
using ContractManagement.Api.DTOs;

namespace ContractManagement.Api.Validators;

public class CreateBlueprintDtoValidator : AbstractValidator<CreateBlueprintDto>
{
    public CreateBlueprintDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Fields).NotEmpty().WithMessage("Blueprint must have at least one field.");
    }
}
