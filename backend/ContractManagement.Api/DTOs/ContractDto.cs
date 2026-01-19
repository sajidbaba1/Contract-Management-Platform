using ContractManagement.Api.Enums;

namespace ContractManagement.Api.DTOs;

public record CreateContractDto(Guid BlueprintId, string Name, System.Text.Json.Nodes.JsonNode? FieldData);
public record UpdateContractDataDto(System.Text.Json.Nodes.JsonNode FieldData);
public record TransitionStatusDto(ContractStatus NewStatus);
public record ContractResponseDto(
    Guid Id, 
    string Name, 
    Guid BlueprintId, 
    string BlueprintName, 
    ContractStatus Status, 
    System.Text.Json.Nodes.JsonNode? FieldData, 
    DateTime CreatedAt
);
