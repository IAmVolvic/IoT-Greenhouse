namespace Greenhouse.Application.Services.Device.Requests;

public class DeviceResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string DeviceName { get; set; } = null!;
    public int DeviceRate { get; set; }
    
    
    public static DeviceResponseDto FromEntity(Domain.DatabaseDtos.Device device, int deviceRate)
    {
        return new DeviceResponseDto()
        {
            Id = device.Id,
            UserId = device.UserId,
            DeviceName = device.DeviceName,
            DeviceRate = deviceRate
        };
    }
}