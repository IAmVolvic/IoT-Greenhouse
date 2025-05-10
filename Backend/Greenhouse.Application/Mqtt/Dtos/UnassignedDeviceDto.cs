using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Application.Mqtt.Dtos;

public class UnassignedDeviceDto
{
    [Required] [MinLength(1)] public Guid DeviceId { get; set; }
}