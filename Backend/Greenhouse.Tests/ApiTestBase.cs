using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Greenhouse.API;
using Greenhouse.API.Controllers;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Infrastructure;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Moq;
using PgCtx;

namespace Greenhouse.Tests;

public static class ApiTestBase
{
    public static IServiceCollection DefaultTestConfig(
        this IServiceCollection services,
        bool useTestContainer = true,
        bool makeWsClient = true,
        Action? customSeeder = null
    )
    {
        if (useTestContainer)
        {
            var db = new PgCtxSetup<AppDbContext>();
            RemoveExistingService<DbContextOptions<AppDbContext>>(services);
            services.AddDbContext<AppDbContext>(opt =>
            {
                opt.UseNpgsql(db._postgres.GetConnectionString());
                opt.EnableSensitiveDataLogging();
                opt.LogTo(_ => { });
            });
        }

        if (customSeeder is not null)
        {
            RemoveExistingService<ISeeder>(services);
            customSeeder.Invoke();
        }

        if (makeWsClient) services.AddScoped<TestWsClient>();

        return services;
    }

    private static void RemoveExistingService<T>(IServiceCollection services)
    {
        var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(T));
        if (descriptor != null)
            services.Remove(descriptor);
    }
    public static async Task<AuthorizedUser> TestRegisterAndSetAuthCookie(HttpClient client)
    {
        var user = new UserSignupDto
        {
            Name = $"{Guid.NewGuid()}@test.com",
            Password = "SecurePassword123!"
        };

        var response = await client.PostAsJsonAsync("Auth/@user/signup", user);

        var auth = await response.Content.ReadFromJsonAsync<AuthorizedUser>(new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? throw new Exception("Failed to register");

        // ✅ Manually set cookie header
        client.DefaultRequestHeaders.Add("Cookie", $"Authentication={auth.JWT}");

        return auth;
    }

}