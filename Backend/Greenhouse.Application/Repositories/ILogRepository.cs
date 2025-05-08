using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Repositories;

public interface ILogRepository
{
    public Log AddDeviceLog(Log deviceLog);
}