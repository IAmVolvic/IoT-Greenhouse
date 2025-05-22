namespace Greenhouse.Application.Services.Device.Requests;

public class ChangeDeviceNameDto
{
    public Guid DeviceId { get; set; }
    public string DeviceName { get; set; }
}