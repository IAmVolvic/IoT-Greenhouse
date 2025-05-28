using WebSocketBoilerplate;

namespace Greenhouse.Application.Websocket;

public class ServerEchosClient : BaseDto
{
    public string EchoValue { get; set; } = null!;
}