namespace Greenhouse.Application.Services.FeatureToggle;

public interface IFeatureToggleService
{
    public bool IsEnabled(string flagName);
}