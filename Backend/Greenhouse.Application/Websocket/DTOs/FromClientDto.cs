using WebSocketBoilerplate;

namespace Greenhouse.Application.Websocket.DTOs;

public class FromClientDto : BaseDto
{
    public string MessageContent { get; set; } = null!;
}