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
        return dbDevice;
    }

}