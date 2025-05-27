namespace Greenhouse.API.FrontendDtos;

public class DeviceAssignDto
{
    public required Guid DeviceId { get; set; }
    public string DeviceName { get; set; } = null!;
}