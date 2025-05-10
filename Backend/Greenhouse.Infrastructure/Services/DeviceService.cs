using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.Device;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Infrastructure.Services;

public class DeviceService(IDeviceRepository deviceRepository, IConnectionManager connectionManager) : IDeviceService
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
}