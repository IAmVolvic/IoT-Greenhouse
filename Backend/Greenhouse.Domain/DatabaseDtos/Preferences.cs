namespace Greenhouse.Domain.DatabaseDtos;

public class Preferences
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public int SensorInterval { get; set; }
}