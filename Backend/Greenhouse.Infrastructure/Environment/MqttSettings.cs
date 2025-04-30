using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Infrastructure.Environment;

public class MqttSettings
{
    [Required] 
    public string MQTT_BROKER_HOST { get; set; }
    [Required] 
    public string MQTT_USERNAME { get; set; }
    [Required] 
    public string MQTT_PASSWORD { get; set; }
}