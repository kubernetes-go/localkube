#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
COPY . /src
WORKDIR /src
RUN dotnet restore "SampleNetCoreWebApp.sln"
RUN dotnet build "SampleNetCoreWebApp.sln"
RUN ls

FROM build AS publish
RUN ls
RUN dotnet publish "SampleNetCoreWebApp/SampleNetCoreWebApp.csproj" -c Release -o /app/publish
RUN ls

FROM base AS final
WORKDIR /app
RUN ls
COPY --from=publish /app/publish .
RUN ls
ENTRYPOINT ["dotnet", "SampleNetCoreWebApp.dll"]