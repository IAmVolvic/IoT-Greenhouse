namespace Greenhouse.Application.Repositories;

public interface IFeatureToggleRepository
{
    public Boolean IsEnabled(string flagName);
}