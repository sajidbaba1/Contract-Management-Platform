using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractManagement.Api.Data;
using ContractManagement.Api.Models;
using ContractManagement.Api.DTOs;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ContractManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlueprintsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlueprintsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlueprintResponseDto>>> GetBlueprints()
    {
        var blueprints = await _context.Blueprints.ToListAsync();
        return blueprints.Select(b => new BlueprintResponseDto(
            b.Id, 
            b.Name, 
            b.Description, 
            JsonSerializer.Deserialize<JsonNode>(b.Fields) ?? new JsonArray(), 
            b.CreatedAt)).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BlueprintResponseDto>> GetBlueprint(Guid id)
    {
        var b = await _context.Blueprints.FindAsync(id);
        if (b == null) return NotFound();

        return new BlueprintResponseDto(
            b.Id, 
            b.Name, 
            b.Description, 
            JsonSerializer.Deserialize<JsonNode>(b.Fields) ?? new JsonArray(), 
            b.CreatedAt);
    }

    [HttpPost]
    public async Task<ActionResult<BlueprintResponseDto>> CreateBlueprint(CreateBlueprintDto dto)
    {
        var blueprint = new Blueprint
        {
            Name = dto.Name,
            Description = dto.Description,
            Fields = dto.Fields.ToJsonString()
        };

        _context.Blueprints.Add(blueprint);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBlueprint), new { id = blueprint.Id }, 
            new BlueprintResponseDto(
                blueprint.Id, 
                blueprint.Name, 
                blueprint.Description, 
                dto.Fields, 
                blueprint.CreatedAt));
    }
}
