using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractManagement.Api.Data;
using ContractManagement.Api.Models;
using ContractManagement.Api.DTOs;
using ContractManagement.Api.Enums;
using ContractManagement.Api.Interfaces;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ContractManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IContractService _contractService;

    public ContractsController(AppDbContext context, IContractService contractService)
    {
        _context = context;
        _contractService = contractService;
    }

    private string GetCurrentUserRole() => Request.Headers["X-User-Role"].FirstOrDefault() ?? "Guest";

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractResponseDto>>> GetContracts()
    {
        var contracts = await _context.Contracts
            .Include(c => c.Blueprint)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return contracts.Select(c => new ContractResponseDto(
            c.Id, 
            c.Name, 
            c.BlueprintId, 
            c.Blueprint != null ? bName(c.Blueprint.Name) : "Unknown", 
            c.Status, 
            c.FieldData != null ? JsonSerializer.Deserialize<JsonNode>(c.FieldData) : null, 
            c.CreatedAt)).ToList();

        string bName(string name) => name;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractResponseDto>> GetContract(Guid id)
    {
        var c = await _context.Contracts.Include(c => c.Blueprint).FirstOrDefaultAsync(c => c.Id == id);
        if (c == null) return NotFound();

        return new ContractResponseDto(
            c.Id, 
            c.Name, 
            c.BlueprintId, 
            c.Blueprint != null ? c.Blueprint.Name : "Unknown", 
            c.Status, 
            c.FieldData != null ? JsonSerializer.Deserialize<JsonNode>(c.FieldData) : null, 
            c.CreatedAt);
    }

    [HttpPost]
    public async Task<ActionResult<ContractResponseDto>> CreateContract(CreateContractDto dto)
    {
        var role = GetCurrentUserRole();
        if (role == "Guest") return Unauthorized("Guests cannot create contracts.");

        var blueprint = await _context.Blueprints.FindAsync(dto.BlueprintId);
        if (blueprint == null) return BadRequest("Blueprint not found.");

        var contract = new Contract
        {
            BlueprintId = dto.BlueprintId,
            Name = dto.Name,
            FieldData = dto.FieldData?.ToJsonString(),
            Status = ContractStatus.Created
        };

        _context.Contracts.Add(contract);
        _context.ContractHistories.Add(new ContractHistory
        {
            Contract = contract,
            ToStatus = ContractStatus.Created,
            ActionBy = role
        });

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetContract), new { id = contract.Id }, 
            new ContractResponseDto(
                contract.Id, 
                contract.Name, 
                contract.BlueprintId, 
                blueprint.Name, 
                contract.Status, 
                dto.FieldData, 
                contract.CreatedAt));
    }

    [HttpPut("{id}/data")]
    public async Task<IActionResult> UpdateContractData(Guid id, UpdateContractDataDto dto)
    {
        var contract = await _context.Contracts.FindAsync(id);
        if (contract == null) return NotFound();

        if (contract.Status == ContractStatus.Locked)
            return BadRequest("Locked contracts are immutable.");

        contract.FieldData = dto.FieldData.ToJsonString();
        contract.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/transition")]
    public async Task<IActionResult> TransitionStatus(Guid id, TransitionStatusDto dto)
    {
        var contract = await _context.Contracts.FindAsync(id);
        if (contract == null) return NotFound();

        var oldStatus = contract.Status;
        var newStatus = dto.NewStatus;
        var role = GetCurrentUserRole();

        if (!_contractService.IsValidTransition(oldStatus, newStatus))
        {
            return BadRequest($"Invalid status transition from {oldStatus} to {newStatus}.");
        }

        if (!_contractService.IsRoleAuthorizedForTransition(role, newStatus))
        {
            return Forbid($"Role '{role}' is not authorized to move contract to {newStatus}.");
        }

        contract.Status = newStatus;
        contract.UpdatedAt = DateTime.UtcNow;

        _context.ContractHistories.Add(new ContractHistory
        {
            ContractId = contract.Id,
            FromStatus = oldStatus,
            ToStatus = newStatus,
            ActionBy = role
        });

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
