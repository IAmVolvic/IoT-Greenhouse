using WebSocketBoilerplate;

namespace Greenhouse.Application.Websocket;

public class ServerEchosClient : BaseDto
{
    public string echoValue { get; set; }
}