using System.Reflection;
using Application.Services;
using Greenhouse.API;
using Greenhouse.Application;
using Greenhouse.Application.Websocket;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Infrastructure;
using Greenhouse.Infrastructure.WebsocketServices;
using Microsoft.EntityFrameworkCore;
using WebSocketBoilerplate;

var builder = WebApplication.CreateBuilder(args);

// ===================== * DATABASE CONTEXT * ===================== //
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===================== * DEPENDENCY INJECTION * ===================== //
builder.Services.AddScoped<IServerToClient, ServerToClient>();
builder.Services.AddScoped<IHelloService, HelloService>();
builder.Services.AddScoped<IWebsocketSubscriptionService, WebsocketSubscriptionService>();
builder.Services.AddSingleton<IConnectionManager, WebSocketConnectionManager>();
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

// ===================== * ROUTES & ENDPOINTS * ===================== //
app.MapControllers();

// ===================== * WEB SOCKET SERVER SETUP * ===================== //
var webSocketHandler = new WebSocketHandler(app, clientEventHandlers);
webSocketHandler.StartServer();

// ===================== * RUN THE APPLICATION * ===================== //
app.Run();