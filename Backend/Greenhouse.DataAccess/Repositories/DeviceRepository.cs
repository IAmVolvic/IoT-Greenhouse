using Greenhouse.Application.Repositories;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.DataAccess.Repositories;

public class DeviceRepository(AppDbContext context) : IDeviceRepository
{
    public List<Device> GetDevicesByUserId(Guid userId)
    {
        return context.Devices
            .Where(d => d.UserId == userId)
            .ToList();
    }
}