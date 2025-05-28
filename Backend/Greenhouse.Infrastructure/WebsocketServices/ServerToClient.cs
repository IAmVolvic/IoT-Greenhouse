using System.Text.Json;
using Greenhouse.Application.Websocket;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;

namespace Greenhouse.Infrastructure.WebsocketServices;

public class ServerToClient : IServerToClient
{
    public string MessageToClient(FromClientDto dto)
    {
        var echo = new ServerEchosClient()
        {
            EchoValue = "echo: " + dto.MessageContent
        };

        var serialized = JsonSerializer.Serialize(echo);
        return serialized;
    }
}