using Greenhouse.Application;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Mqtt.Interfaces;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.Device;
using Greenhouse.Application.Services.Device.Requests;
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
    
    public List<DeviceResponseDto> UserDevices(Guid userId)
    {
        var devices = GetDevicesForUser(userId);
        var deviceResponseDtos = new List<DeviceResponseDto>();

        var index = 0;
        while (index < devices.Count)
        {
            var device = devices[index];
            var currentPreferences = deviceRepository.GetCurrentPreferences(device.Id);
            
            var deviceRate = currentPreferences?.SensorInterval ?? 0;
            var dto = DeviceResponseDto.FromEntity(device, deviceRate);
            
            deviceResponseDtos.Add(dto);
            index++;
        }

        return deviceResponseDtos;
    }
    
    public async void UpdateDeviceName(ChangeDeviceNameDto changeDeviceNameDto)
    {
        var currentDevice = deviceRepository.GetDevicesByDeviceId(changeDeviceNameDto.DeviceId);
        currentDevice.DeviceName = changeDeviceNameDto.DeviceName;
        deviceRepository.UpdateDevice(currentDevice);
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

        var dbDevice = deviceRepository.AssignDeviceToUser(device);
        deviceRepository.SetDefaultPreferences(preferences);
        deviceRepository.DeleteFromUnassignedDevices(deviceId);
        return dbDevice;
    }

    public async Task<Preferences> UpdatePreferences(PreferencesChangeDto preferencesDto)
    {
        var currentPreferences = deviceRepository.GetCurrentPreferences(preferencesDto.DeviceId);
        currentPreferences.SensorInterval = preferencesDto.SensorInterval;
        
        var topic = $"preferences/{preferencesDto.DeviceId}";

        try
        {
            await mqttPublisher.Publish(currentPreferences.SensorInterval, topic, QualityOfService.ExactlyOnceDelivery);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Your device is unresponsive", ex);
        }

        var dbPreferences = deviceRepository.ChangePreferences(currentPreferences);
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
        var currentConnections = await connectionManager.GetMembersFromTopicId(deviceId.ToString());
        foreach (var connection in currentConnections)
        {
            await connectionManager.RemoveFromTopic(deviceId.ToString(), connection);
        }
        return deviceId;
    }

    public void CheckAndAddUnassignedDevice(UnassignedDeviceDto device)
    {
        if (!deviceRepository.DeviceExists(device.DeviceId) && !deviceRepository.DeviceExistsInUnassignedDevices(device.DeviceId))
        {
            var unassignedDevice = new UnassignedDevice()
            {
                Id = device.DeviceId,
            };
            deviceRepository.AddDeviceToUnassignedDevices(unassignedDevice);
        }
    }

    public List<UnassignedDevice> GetUnassignedDevices()
    {
        return deviceRepository.GetUnassignedDevices();
    }
}