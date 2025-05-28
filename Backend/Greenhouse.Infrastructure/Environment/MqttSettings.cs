using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Infrastructure.Environment;

public class MqttSettings
{
    [Required] 
    public string MQTT_BROKER_HOST { get; set; } = null!;
    [Required] 
    public string MQTT_USERNAME { get; set; } = null!;
    [Required] 
    public string MQTT_PASSWORD { get; set; } = null!;
}