using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.FeatureToggle;

namespace Greenhouse.Infrastructure.Services;

public class FeatureToggleService(IFeatureToggleRepository ftRepository) : IFeatureToggleService
{
    public bool IsEnabled(string flagName)
    {
        return ftRepository.IsEnabled(flagName);
    }
}