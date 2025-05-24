using Serilog;

namespace Greenhouse.Infrastructure.Services;

public class MonitorService
{
    public static ILogger log => Serilog.Log.Logger;

    static MonitorService()
    {
        Serilog.Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Verbose()
            .WriteTo.Console()
            .WriteTo.Seq("http://localhost:5341")
            .CreateLogger();
            
    }
}