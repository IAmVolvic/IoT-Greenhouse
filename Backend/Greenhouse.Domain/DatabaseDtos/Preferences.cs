namespace Greenhouse.Domain.DatabaseDtos;

public class Preferences
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string SSID { get; set; }
    public string Passwordhash { get; set; }
    public int SensorInterval { get; set; }
}