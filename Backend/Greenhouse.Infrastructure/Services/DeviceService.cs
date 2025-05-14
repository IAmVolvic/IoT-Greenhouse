
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Mqtt.Interfaces;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.Device;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Domain.DatabaseDtos;
using HiveMQtt.MQTT5.Types;

namespace Greenhouse.Infrastructure.Services;

public class DeviceService(IDeviceRepository deviceRepository, IConnectionManager connectionManager, IMqttPublisher mqttPublisher) : IDeviceService
{
    public List<Device> GetDevicesForUser(Guid userId)
    {
        return deviceRepository.GetDevicesByUserId(userId);
    }
    
    public void BroadcastUnassignedDeviceInfo(UnassignedDeviceDto unassignedDeviceDto)
    {
        var deviceInfo = new ServerBroadcastsUnassignedDeviceToDashboard()
        {
            DeviceId = unassignedDeviceDto.DeviceId,
        };
        connectionManager.BroadcastToTopic("unassignedDevices", deviceInfo);
    }

    public async Task<Device> AssignDeviceToUser(Guid userId, Guid deviceId, string deviceName)
    {
        var device = new Device
        {
            Id = deviceId,
            DeviceName = deviceName,
            UserId = userId,
        };

        var preferences = new Preferences()
        {
            Id = Guid.NewGuid(),
            DeviceId = deviceId,
            SensorInterval = 1000
        };

        var topic = $"user/assign/{deviceId}";

        try
        {
            await mqttPublisher.Publish(userId, topic, QualityOfService.ExactlyOnceDelivery);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Your device is unresponsive", ex);
        }
        deviceRepository.SetDefaultPreferences(preferences);
        var dbDevice = deviceRepository.AssignDeviceToUser(device);
        return dbDevice;
    }

    public async Task<Preferences> UpdatePreferences(PreferencesChangeDto preferencesDto)
    {
        var currentPreferences = deviceRepository.GetCurrentPreferences(preferencesDto.DeviceId);
        var preferences = new Preferences()
        {
            Id = currentPreferences.Id,
            DeviceId = preferencesDto.DeviceId,
            SensorInterval = preferencesDto.SensorInterval,
        };
        
        var topic = $"preferences/{preferencesDto.DeviceId}";

        try
        {
            await mqttPublisher.Publish(preferences.SensorInterval, topic, QualityOfService.ExactlyOnceDelivery);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Your device is unresponsive", ex);
        }

        var dbPreferences = deviceRepository.ChangePreferences(preferences);
        return dbPreferences;
    }

    public async Task<Guid> RemoveDeviceFromUser(Guid deviceId)
    {
        var topic = $"user/assign/{deviceId}";
        try
        {
            await mqttPublisher.Publish("unassigned", topic, QualityOfService.ExactlyOnceDelivery);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Your device is unresponsive", ex);
        }
        var device = deviceRepository.GetDevicesByDeviceId(deviceId);
        deviceRepository.RemoveDeviceFromUser(device);
        return deviceId;
    }
}