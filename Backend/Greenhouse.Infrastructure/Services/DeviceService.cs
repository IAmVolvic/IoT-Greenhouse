using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.Device;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Infrastructure.Services;

public class DeviceService(IDeviceRepository deviceRepository) : IDeviceService
{
    public List<Device> GetDevicesForUser(Guid userId)
    {
        return deviceRepository.GetDevicesByUserId(userId);
    }
}