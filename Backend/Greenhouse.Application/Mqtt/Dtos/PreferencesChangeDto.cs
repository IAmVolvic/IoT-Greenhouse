namespace Greenhouse.Application.Mqtt.Dtos;

public class PreferencesChangeDto
{
    public Guid DeviceId { get; set; }
    public int SensorInterval { get; set; }
}