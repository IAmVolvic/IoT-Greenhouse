using Greenhouse.Application;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security;
using Greenhouse.Application.Services.Device;
using Greenhouse.Application.Services.FeatureToggle;
using Greenhouse.Application.Services.Logs;
using Greenhouse.Application.Services.User;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure.Infrastructure.DataAccess.Repositories;
using Greenhouse.Infrastructure.Security;
using Greenhouse.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Greenhouse.Infrastructure.Infrastructure.Dependencies;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ILogRepository, LogRepository>();
        services.AddScoped<IDeviceRepository, DeviceRepository>();
        services.AddScoped<IFeatureToggleRepository, FeatureToggleRepository>();
        
        services.AddScoped<ILogService, LogService>();
        services.AddScoped<IHelloService, HelloService>();
        services.AddScoped<IDeviceService, DeviceService>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService.AuthService>();
        services.AddScoped<IJwtManager, JwtManager>();
        
        services.AddScoped<IFeatureToggleService, FeatureToggleService>();
        
        return services;
    }
}