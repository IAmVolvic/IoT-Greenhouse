namespace Greenhouse.Application.Services.Device.Requests;

public class DeviceResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string DeviceName { get; set; }
    public int DeviceRate { get; set; }
    
    
    public static DeviceResponseDto FromEntity(Domain.DatabaseDtos.Device device, int DeviceRate)
    {
        return new DeviceResponseDto()
        {
            Id = device.Id,
            UserId = device.UserId,
            DeviceName = device.DeviceName,
            DeviceRate = DeviceRate
        };
    }
}