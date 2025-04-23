using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Greenhouse.Domain.DatabaseDtos;

public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Passwordhash { get; set; } = null!;
    
    [JsonConverter(typeof(StringEnumConverter))]
    public UserRole Role { get; set; }
}