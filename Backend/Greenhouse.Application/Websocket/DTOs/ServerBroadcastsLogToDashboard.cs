using Greenhouse.Domain.DatabaseDtos;
using WebSocketBoilerplate;

namespace Greenhouse.Application.Websocket.DTOs;

public class ServerBroadcastsLogToDashboard : BaseDto
{
    public Log Log { get; set; } = null!;
}