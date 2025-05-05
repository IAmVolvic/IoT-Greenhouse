using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Repositories;

public interface IDeviceRepository
{
    public List<Device> GetDevicesByUserId(Guid userId);
}