namespace Greenhouse.Domain.DatabaseDtos;

public class Preferences
{
    public Guid Id { get; set; }
    public Guid DeviceId { get; set; }
    public string SSID { get; set; }
    public string Passwordhash { get; set; }
    public int SensorInterval { get; set; }
}