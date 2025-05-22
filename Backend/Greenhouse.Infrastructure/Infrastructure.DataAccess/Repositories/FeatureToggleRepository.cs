using Greenhouse.Application.Repositories;

namespace Greenhouse.Infrastructure.Infrastructure.DataAccess.Repositories;

public class FeatureToggleRepository(AppDbContext context) : IFeatureToggleRepository
{
    public bool IsEnabled(string flagName)
    {
        return context.FeatureFlag
            .Where(f => f.FlagName == flagName)
            .Select(f => f.IsToggled)
            .FirstOrDefault();
    }
}