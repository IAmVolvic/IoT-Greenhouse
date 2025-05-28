namespace Greenhouse.Domain.DatabaseDtos;

public class FeatureFlag
{
    public Guid Id { get; set; }
    public string FlagName { get; set; } = null!;
    public Boolean IsToggled { get; set; }
}