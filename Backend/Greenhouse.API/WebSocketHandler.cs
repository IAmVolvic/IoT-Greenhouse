using System.Web;
using Fleck;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;
using Newtonsoft.Json;
using WebSocketBoilerplate;

namespace Greenhouse.API;

public class WebSocketHandler(WebApplication app, HashSet<Type> clientEventHandlers)
{
    private readonly List<IWebSocketConnection> _wsConnections = new List<IWebSocketConnection>();

    public void StartServer()
    {
        var server = new WebSocketServer("ws://0.0.0.0:4001");
        
        server.Start(ws =>
        {
            var queryString = ws.ConnectionInfo.Path.Split('?').Length > 1
                ? ws.ConnectionInfo.Path.Split('?')[1]
                : "";

            var id = HttpUtility.ParseQueryString(queryString)["id"] ??
                     throw new Exception("Please specify ID query param for websocket connection");
            
            using var scope = app.Services.CreateScope();
            var manager = scope.ServiceProvider.GetRequiredService<IConnectionManager>();
            
            ws.OnOpen = () => manager.OnOpen(ws,id);
            
            ws.OnClose = () => manager.OnClose(ws, id);

            ws.OnMessage = message =>
            {
                foreach (var clients in _wsConnections)
                {
                    clients.Send("Everyone");
                }
                
                try
                {
                    var eventTask = app.InvokeClientEventHandler(clientEventHandlers, ws, message);
                    
                    if (eventTask.Exception == null) return;
                    var error = JsonConvert.SerializeObject(new WebsocketError(ErrorType.SOFT, eventTask.Exception.Message));
                    ws.Send(error);
                }
                catch (Exception e)
                {
                    var error = JsonConvert.SerializeObject(new WebsocketError(ErrorType.CRITICAL, e.Message));
                    ws.Send(error);
                }
            };
        });
    }
}