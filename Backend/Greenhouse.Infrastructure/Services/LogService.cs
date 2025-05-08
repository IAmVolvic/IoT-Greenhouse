using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.Logs;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Infrastructure.Services;

public class LogService(ILogRepository logRepository,IConnectionManager connectionManager) : ILogService
{
    public void AddToDbAndBroadcast(DeviceLogDto log)
    {
        var deviceLog = new Log()
        {
            Id = Guid.NewGuid(),
            DeviceId = log.DeviceId,
            Unit = log.Unit,
            Value = log.Value,
            Type = log.Type,
            Date = DateTime.UtcNow
        };
        logRepository.AddDeviceLog(deviceLog);
        var logBroadcast = new ServerBroadcastsLogToDashboard()
        {
            log = deviceLog
        };
        connectionManager.BroadcastToTopic(deviceLog.DeviceId.ToString(), logBroadcast);
    }
}