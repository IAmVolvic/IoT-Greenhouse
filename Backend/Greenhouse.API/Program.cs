using System.Reflection;
using API.ActionFilters;
using Application.Services;
using Greenhouse.API;
using Greenhouse.API.ActionFilters;
using Greenhouse.Application;
using Greenhouse.Application.Security;
using Greenhouse.Application.Websocket;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Domain;
using Greenhouse.Infrastructure;
using Greenhouse.Infrastructure.Security;
using Greenhouse.Infrastructure.WebsocketServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Service.Services;
using Service.Services.Interfaces;
using WebSocketBoilerplate;

var builder = WebApplication.CreateBuilder(args);

// ===================== * DATABASE CONTEXT * ===================== //
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===================== * DEPENDENCY INJECTION * ===================== //
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.AddService<AuthenticatedFilter>();
});
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
});

builder.Services.AddScoped<IServerToClient, ServerToClient>();
builder.Services.AddScoped<IHelloService, HelloService>();
builder.Services.AddScoped<IWebsocketSubscriptionService, WebsocketSubscriptionService>();
builder.Services.AddSingleton<IConnectionManager, WebSocketConnectionManager>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtManager, JwtManager>();
builder.Services.AddScoped<AuthenticatedFilter>();
// ===================== * CONTROLLERS & MVC * ===================== //
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===================== * BUILD & MIDDLEWARE PIPELINE * ===================== //
var clientEventHandlers = builder.FindAndInjectClientEventHandlers(Assembly.GetExecutingAssembly());
var app = builder.Build();

// ===================== * SWAGGER SETUP * ===================== //
app.UseSwagger();
app.UseSwaggerUI();

// ===================== * CORS SETUP * ===================== //
app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowSpecificOrigin", policy =>
//     {
//         // Replace with the exact origin of your front-end application
//         policy.WithOrigins("*")
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials();
//     });
// });

// ===================== * ROUTES & ENDPOINTS * ===================== //
app.MapControllers();

// ===================== * WEB SOCKET SERVER SETUP * ===================== //
var webSocketHandler = new WebSocketHandler(app, clientEventHandlers);
webSocketHandler.StartServer();

// ===================== * RUN THE APPLICATION * ===================== //
app.Run();