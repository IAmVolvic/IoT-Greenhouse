using System.Reflection;
using Greenhouse.API;
using Greenhouse.API.ActionFilters;
using Greenhouse.Application;
using Greenhouse.Application.Environment;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security;
using Greenhouse.Application.Services.Logs;
using Greenhouse.Application.Services.User;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.DataAccess;
using Greenhouse.DataAccess.Repositories;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure.AuthService;
using Greenhouse.Infrastructure.Environment;
using Greenhouse.Infrastructure.MqttServices.MqttSubscriptionEventHandlers;
using Greenhouse.Infrastructure.Security;
using Greenhouse.Infrastructure.Services;
using Greenhouse.Infrastructure.WebsocketServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebSocketBoilerplate;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.Configure(context.Configuration.GetSection("Kestrel"));
});

// ===================== * DATABASE CONTEXT * ===================== //
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILogRepository, LogRepository>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<PasswordSettings>(builder.Configuration.GetSection("PasswordSettings"));
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("MqttSettings"));

// ===================== * DEPENDENCY INJECTION * ===================== //
// Filters
builder.Services.AddScoped<AuthenticatedFilter>();
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.AddService<AuthenticatedFilter>();
});
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
});

// Websocket and SignalR
builder.Services.AddScoped<IServerToClient, ServerToClient>();
builder.Services.AddScoped<IWebsocketSubscriptionService, WebsocketSubscriptionService>();
builder.Services.AddSingleton<IConnectionManager, WebSocketConnectionManager>();

// Services and Security
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IHelloService, HelloService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtManager, JwtManager>();
builder.Services.RegisterMqttInfrastructure();
// ===================== * CONTROLLERS & MVC * ===================== //
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===================== * CORS CONFIGURATION * ===================== //
string[] allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
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

// ===================== * BUILD & MIDDLEWARE PIPELINE * ===================== //
var clientEventHandlers = builder.FindAndInjectClientEventHandlers(Assembly.GetExecutingAssembly());
var app = builder.Build();

// ===================== * SWAGGER SETUP * ===================== //
app.UseSwagger();
app.UseSwaggerUI();

// ===================== * CORS SETUP * ===================== //
app.UseCors("AllowedOriginsPolicy");

// ===================== * ROUTES & ENDPOINTS * ===================== //
app.MapControllers();
await app.ConfigureMqtt();
// ===================== * WEB SOCKET SERVER SETUP * ===================== //
var webSocketHandler = new WebSocketHandler(app, clientEventHandlers);
webSocketHandler.StartServer();

// ===================== * RUN THE APPLICATION * ===================== //
app.Run();