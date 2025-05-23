using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Services.Device.Requests;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Services.Device;

public interface IDeviceService
{
    public List<Domain.DatabaseDtos.Device> GetDevicesForUser(Guid userId);
    public void CheckAndAddUnassignedDevice(UnassignedDeviceDto device);
    public Task<Domain.DatabaseDtos.Device> AssignDeviceToUser(Guid userId, Guid deviceId, string deviceName);
    public Task<Preferences> UpdatePreferences(PreferencesChangeDto preferences);
    public Task<Guid> RemoveDeviceFromUser(Guid deviceId);
    public List<UnassignedDevice> GetUnassignedDevices();

    public List<DeviceResponseDto> UserDevices(Guid userId);
    
    public void UpdateDeviceName(ChangeDeviceNameDto device);
}