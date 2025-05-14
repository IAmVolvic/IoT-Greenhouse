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
}