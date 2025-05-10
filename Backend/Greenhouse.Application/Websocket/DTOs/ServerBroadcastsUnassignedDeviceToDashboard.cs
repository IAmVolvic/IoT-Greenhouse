using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Application.Websocket.DTOs;

public class ServerBroadcastsUnassignedDeviceToDashboard
{
    [Required] [MinLength(1)] public Guid DeviceId { get; set; }
}