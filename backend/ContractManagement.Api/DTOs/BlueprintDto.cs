namespace ContractManagement.Api.DTOs;

public record CreateBlueprintDto(string Name, string? Description, System.Text.Json.Nodes.JsonNode Fields);
public record BlueprintResponseDto(Guid Id, string Name, string? Description, System.Text.Json.Nodes.JsonNode Fields, DateTime CreatedAt);
