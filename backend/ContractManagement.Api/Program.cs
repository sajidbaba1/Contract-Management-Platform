using Microsoft.EntityFrameworkCore;
using ContractManagement.Api.Data;
using System.Text.Json.Serialization;
using System.Text.Json;
using FluentValidation.AspNetCore;
using FluentValidation;
using ContractManagement.Api.Validators;
using ContractManagement.Api.Interfaces;
using ContractManagement.Api.Services;
using Scalar.AspNetCore;

// Load .env file
var root = Directory.GetCurrentDirectory();
var dotenv = Path.Combine(root, ".env");
if (File.Exists(dotenv))
{
    foreach (var line in File.ReadAllLines(dotenv))
    {
        var parts = line.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length != 2) continue;
        Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
    }
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// Register Services
builder.Services.AddScoped<IContractService, ContractService>();

// Configure FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateBlueprintDtoValidator>();

// Configure OpenAPI (Native .NET 10 approach)
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info.Title = "Contract Management API";
        document.Info.Version = "v1";
        document.Info.Description = "Enterprise Contract Management Platform API with RBAC & Data Management Capabilities";
        return Task.CompletedTask;
    });
});

// Configure Swagger for legacy UI support (as requested)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


// Configure DbContext with resolved connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    connectionString = connectionString
        .Replace("{DB_HOST}", Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost")
        .Replace("{DB_PORT}", Environment.GetEnvironmentVariable("DB_PORT") ?? "5432")
        .Replace("{DB_NAME}", Environment.GetEnvironmentVariable("DB_NAME") ?? "contract")
        .Replace("{DB_USER}", Environment.GetEnvironmentVariable("DB_USER") ?? "postgres")
        .Replace("{DB_PASS}", Environment.GetEnvironmentVariable("DB_PASS") ?? "");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Automatically create database on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    // Native OpenApi endpoint (/openapi/v1.json)
    app.MapOpenApi();
    
    // Traditional Swagger UI (/swagger)
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Modern UI for API testing (/scalar/v1)
    app.MapScalarApiReference();
}

// Global Error Handling
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "An internal server error occurred.", details = ex.Message }));
    }
});

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
