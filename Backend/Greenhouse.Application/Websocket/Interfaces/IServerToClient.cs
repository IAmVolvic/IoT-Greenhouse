using Greenhouse.Application.Websocket.DTOs;

namespace Greenhouse.Application.Websocket.Interfaces;

public interface IServerToClient
{
    string MessageToClient(FromClientDto dto);
}