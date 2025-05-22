using Greenhouse.Application.Repositories;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Infrastructure.Infrastructure.DataAccess.Repositories;

public class DeviceRepository(AppDbContext context) : IDeviceRepository
{
    public List<Device> GetDevicesByUserId(Guid userId)
    {
        return context.Devices
            .Where(d => d.UserId == userId)
            .ToList();
    }
    public Device AssignDeviceToUser(Device device)
    {
        context.Devices.Add(device);
        context.SaveChanges();
        return device;
    }

    public Preferences ChangePreferences(Preferences preferences)
    {
        context.Preferences.Update(preferences);
        context.SaveChanges();
        return preferences;
    }

    public Preferences GetCurrentPreferences(Guid deviceId)
    {
        var preference = context.Preferences
            .SingleOrDefault(p => p.DeviceId == deviceId);
        return preference;
    }

    public void SetDefaultPreferences(Preferences preferences)
    {
        context.Preferences.Add(preferences);
        context.SaveChanges();
    }

    public void RemoveDeviceFromUser(Device device)
    {
        context.Devices.Remove(device);
        context.SaveChanges();
    }

    public Device GetDevicesByDeviceId(Guid deviceId)
    {
        return context.Devices.SingleOrDefault(d => d.Id == deviceId);
    }

    public bool DeviceExists(Guid deviceId)
    {
        return context.Devices.Any(d => d.Id == deviceId);
    }

    public bool DeviceExistsInUnassignedDevices(Guid deviceId)
    {
        return context.UnassignedDevices.Any(d => d.Id == deviceId);
    }

    public void AddDeviceToUnassignedDevices(UnassignedDevice unassignedDevice)
    {
        context.UnassignedDevices.Add(unassignedDevice);
        context.SaveChanges();
    }

    public List<UnassignedDevice> GetUnassignedDevices()
    {
        return context.UnassignedDevices.ToList();
    }

    public void DeleteFromUnassignedDevices(Guid deviceId)
    {
        var unassignedDevice = context.UnassignedDevices.SingleOrDefault(d => d.Id == deviceId);
        if (unassignedDevice != null)
        {
            context.UnassignedDevices.Remove(unassignedDevice);
            context.SaveChanges();
        }
    }

    public void UpdateDevice(Device device)
    {
        context.Devices.Update(device);
        context.SaveChanges();
    }
}