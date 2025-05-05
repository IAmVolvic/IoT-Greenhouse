using Greenhouse.Application.Mqtt.Dtos;

namespace Greenhouse.Application.Services.Logs;

public interface ILogService
{
    public void AddToDbAndBroadcast(DeviceLogDto log);
}