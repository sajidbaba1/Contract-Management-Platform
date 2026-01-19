FROM mcr.microsoft.com/dotnet/sdk:10.0-preview.1 AS build
WORKDIR /src
COPY ["ContractManagement.Api.csproj", "./"]
RUN dotnet restore "ContractManagement.Api.csproj"
COPY . .
RUN dotnet build "ContractManagement.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ContractManagement.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview.1 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ContractManagement.Api.dll"]
