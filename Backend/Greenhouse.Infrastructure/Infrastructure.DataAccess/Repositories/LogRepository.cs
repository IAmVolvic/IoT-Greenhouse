using Greenhouse.Application.Repositories;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Infrastructure.Infrastructure.DataAccess.Repositories;

public class LogRepository(AppDbContext context) : ILogRepository
{
    public Log AddDeviceLog(Log deviceLog)
    {
        context.Logs.Add(deviceLog);
        context.SaveChanges();
        return deviceLog;
    }
}