namespace Greenhouse.Domain.DatabaseDtos;

public class Device
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string DeviceName { get; set; }
}