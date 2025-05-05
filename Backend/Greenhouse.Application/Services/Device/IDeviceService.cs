namespace Greenhouse.Application.Services.Device;

public interface IDeviceService
{
    public List<Domain.DatabaseDtos.Device> GetDevicesForUser(Guid userId);
}