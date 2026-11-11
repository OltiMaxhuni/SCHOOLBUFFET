FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Backend/SchoolBuffet.Api/SchoolBuffet.Api.csproj Backend/SchoolBuffet.Api/
RUN dotnet restore Backend/SchoolBuffet.Api/SchoolBuffet.Api.csproj

COPY Backend/ Backend/
RUN dotnet publish Backend/SchoolBuffet.Api/SchoolBuffet.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app ./
COPY Frontend/ ./Frontend/

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:10000
ENV DOTNET_EnableDiagnostics=0

EXPOSE 10000

ENTRYPOINT ["dotnet", "SchoolBuffet.Api.dll"]
