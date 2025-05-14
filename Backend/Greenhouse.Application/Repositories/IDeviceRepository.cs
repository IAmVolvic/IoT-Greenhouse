using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Repositories;

public interface IDeviceRepository
{
    public List<Device> GetDevicesByUserId(Guid userId);
    public Device AssignDeviceToUser(Device device);
    public Preferences ChangePreferences(Preferences preferences);
    public Preferences GetCurrentPreferences(Guid deviceId);
    public void SetDefaultPreferences(Preferences preferences);
}