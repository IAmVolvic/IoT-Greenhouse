using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using System.Web;
using Fleck;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebSocketBoilerplate;

namespace Greenhouse.API;

public static class WebSocketHandler
{
    public static IServiceCollection RegisterWebsocketApiServices(this IServiceCollection services)
    {
        var assembly = typeof(WebSocketHandler).Assembly;
        services.InjectEventHandlers(assembly);
        return services;
    }

    public static Task<WebApplication> ConfigureWebsocketApi(this WebApplication app, int wsPort = 4001)
    {
        var url = $"ws://0.0.0.0:4001";

        var logger = app.Services.GetRequiredService<ILogger<NonStaticWsExtensionClassForLogger>>();
        logger.LogInformation("WebSocket server running at: {Url}", url);

        var server = new WebSocketServer(url);

        server.Start(ws =>
        {
            var queryString = ws.ConnectionInfo.Path.Split('?').Length > 1
                ? ws.ConnectionInfo.Path.Split('?')[1]
                : "";

            var id = HttpUtility.ParseQueryString(queryString)["id"]
                     ?? throw new InvalidOperationException("Missing 'id' query parameter for WebSocket connection.");

            using var scope = app.Services.CreateScope();
            var manager = scope.ServiceProvider.GetRequiredService<IConnectionManager>();

            ws.OnOpen = () => manager.OnOpen(ws, id);
            ws.OnClose = () => manager.OnClose(ws, id);

            ws.OnMessage = message =>
            {
                try
                { 
                    app.CallEventHandler(ws, message);
                }
                catch (Exception e)
                {
                    var error = JsonConvert.SerializeObject(new WebsocketError(ErrorType.CRITICAL, e.Message));
                    ws.Send(error);
                }
            };
        });

        return Task.FromResult(app);
    }
}

public abstract class NonStaticWsExtensionClassForLogger { }
