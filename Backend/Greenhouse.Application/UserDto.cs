using System.Text.Json.Serialization;
using Greenhouse.Application.Security;

namespace Greenhouse.Application;

public class UserDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Passwordhash { get; set; } = null!;
    
    [Newtonsoft.Json.JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole Role { get; set; }
}