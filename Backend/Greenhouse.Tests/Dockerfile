FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

COPY . .

RUN dotnet restore
RUN dotnet build --configuration Release
CMD ["dotnet", "test", "--logger:trx"]
