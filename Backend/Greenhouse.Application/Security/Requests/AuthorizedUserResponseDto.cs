using System.Text.Json.Serialization;
using Greenhouse.Domain;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Security.Requests;

public class AuthorizedUserResponseDto
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole Role { get; set; }
    
    
    public static AuthorizedUserResponseDto FromEntity(User user)
    {
        return new AuthorizedUserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Role = user.Role,
        };
    }
}