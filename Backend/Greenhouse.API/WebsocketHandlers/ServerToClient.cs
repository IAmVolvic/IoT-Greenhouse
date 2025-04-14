using Fleck;
using Greenhouse.Application.Websocket;
using Greenhouse.Application.Websocket.Interfaces;
using WebSocketBoilerplate;

namespace Greenhouse.API.WebsocketHandlers;

public class ServerToClient(IServiceScopeFactory scopeFactory) : BaseEventHandler<FromClientDto>
{
    private readonly IServerToClient _service = scopeFactory.CreateScope().ServiceProvider.GetRequiredService<IServerToClient>();


    public override async Task Handle(FromClientDto dto, IWebSocketConnection socket)
    { 
        var message = _service.MessageToClient(dto);
        await socket.Send(message);
    }
}