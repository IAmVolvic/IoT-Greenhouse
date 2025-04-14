using WebSocketBoilerplate;

namespace Greenhouse.Application.Websocket;

public class FromClientDto : BaseDto
{
    public string messageContent { get; set; }
}