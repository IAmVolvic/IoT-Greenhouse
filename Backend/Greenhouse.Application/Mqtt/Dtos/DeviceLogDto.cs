using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Application.Mqtt.Dtos;

public class DeviceLogDto
{
    [Required] [MinLength(1)] public string Unit { get; set; }
    [Required] [MinLength(1)] public decimal Value { get; set; }
    [Required] [MinLength(1)] public Guid DeviceId { get; set; }
    [Required] [MinLength(1)] public string Type { get; set; }
}