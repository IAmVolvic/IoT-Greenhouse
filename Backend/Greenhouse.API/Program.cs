using System.Reflection;
using System.Text.Json;
using Greenhouse.API;
using Greenhouse.API.ActionFilters;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Infrastructure.Environment;
using Greenhouse.Infrastructure.Infrastructure.Dependencies;
using Greenhouse.Infrastructure.WebsocketServices;
using Greenhouse.Application.Environment;
using Greenhouse.Application.Security;
using Greenhouse.Infrastructure;
using Greenhouse.Infrastructure.AuthService;
using Greenhouse.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebSocketBoilerplate;

public class Program
{
 public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var configuration = builder.Configuration;

        builder.WebHost.ConfigureKestrel((context, options) =>
        {
            options.Configure(context.Configuration.GetSection("Kestrel"));
        });

        // === DB Context ===
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // === Infrastructure & Settings ===
        builder.Services.AddInfrastructure();
        builder.Services.RegisterMqttInfrastructure(); 

        builder.Services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        builder.Services.Configure<PasswordSettings>(configuration.GetSection("PasswordSettings"));
        builder.Services.Configure<MqttSettings>(configuration.GetSection("MqttSettings"));

        // === Manual Dependency Injection for Security ===
        builder.Services.AddScoped<IJwtManager, JwtManager>();
        builder.Services.AddScoped<IAuthService, AuthService>();

        // === Filters ===
        builder.Services.AddScoped<AuthenticatedFilter>();
        builder.Services.AddControllersWithViews(options =>
        {
            options.Filters.AddService<AuthenticatedFilter>();
        });
        builder.Services.AddControllers(options =>
        {
            options.Filters.Add<ExceptionFilter>();
        });

        // === WebSocket Services ===
        builder.Services.AddScoped<IServerToClient, ServerToClient>();
        builder.Services.AddScoped<IWebsocketSubscriptionService, WebsocketSubscriptionService>();
        builder.Services.AddSingleton<IConnectionManager, WebSocketConnectionManager>();
        builder.Services.InjectEventHandlers(typeof(WebSocketHandler).Assembly); 

        // === Swagger, REST, CORS etc ===
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        string[] allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowedOriginsPolicy", builder =>
            {
                builder.WithOrigins(allowedOrigins)
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
            });
        });

        var app = builder.Build();

        await ConfigureMiddleware(app, configuration);
        await app.RunAsync();
    }


    private static async Task ConfigureMiddleware(WebApplication app, IConfiguration config)
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        var options = app.Services.GetRequiredService<IOptionsMonitor<JwtSettings>>().CurrentValue;
        logger.LogInformation(JsonConvert.SerializeObject(options));

        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseCors("AllowedOriginsPolicy");
        app.MapControllers();

        // Optional MQTT setup
        await app.ConfigureMqtt();

        // WebSocket setup
        await app.ConfigureWebsocketApi(4001);

        app.MapGet("/acceptance", () => "Accepted");
    }
}
