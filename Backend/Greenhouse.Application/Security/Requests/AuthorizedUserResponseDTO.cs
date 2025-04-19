using System.Text.Json.Serialization;
using Greenhouse.Application;
using Greenhouse.Application.Security;
using Greenhouse.Domain;

namespace Service.TransferModels.Responses;

public class AuthorizedUserResponseDTO
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole Role { get; set; }
    
    
    public static AuthorizedUserResponseDTO FromEntity(User user)
    {
        return new AuthorizedUserResponseDTO
        {
            Id = user.Id,
            Name = user.Name,
            Role = user.Role,
        };
    }
}