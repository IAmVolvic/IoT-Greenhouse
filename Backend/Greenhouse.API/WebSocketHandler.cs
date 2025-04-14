using Fleck;
using Greenhouse.Application.Websocket.DTOs;
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
            ws.OnOpen = () => { _wsConnections.Add(ws); };

            ws.OnMessage = message =>
            {
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