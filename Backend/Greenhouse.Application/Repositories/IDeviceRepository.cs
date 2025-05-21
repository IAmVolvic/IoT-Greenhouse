using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Repositories;

public interface IDeviceRepository
{
    public List<Device> GetDevicesByUserId(Guid userId);
    public Device AssignDeviceToUser(Device device);
    public Preferences ChangePreferences(Preferences preferences);
    public Preferences GetCurrentPreferences(Guid deviceId);
    public void SetDefaultPreferences(Preferences preferences);
    public void RemoveDeviceFromUser(Device device);
    public Device GetDevicesByDeviceId(Guid deviceId);
    public bool DeviceExists(Guid deviceId);
    public bool DeviceExistsInUnassignedDevices(Guid deviceId);
    public void AddDeviceToUnassignedDevices(UnassignedDevice unassignedDevice);
    public List<UnassignedDevice> GetUnassignedDevices();
    public void DeleteFromUnassignedDevices(Guid deviceId);
}