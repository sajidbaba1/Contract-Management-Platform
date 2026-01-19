using FluentValidation;
using ContractManagement.Api.DTOs;

namespace ContractManagement.Api.Validators;

public class CreateContractDtoValidator : AbstractValidator<CreateContractDto>
{
    public CreateContractDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.BlueprintId).NotEmpty();
    }
}

public class TransitionStatusDtoValidator : AbstractValidator<TransitionStatusDto>
{
    public TransitionStatusDtoValidator()
    {
        RuleFor(x => x.NewStatus).IsInEnum();
    }
}
