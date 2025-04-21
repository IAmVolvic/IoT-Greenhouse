using Greenhouse.Domain;

namespace Greenhouse.Application.Security.Requests;

public class UserLoginResponseDto
{
    public string Id { get; set; } = null!;
    
    public string JwtToken { get; set; } = null!;

    public static UserLoginResponseDto FromEntity(User user, IJwtManager manager)
    {
        return new UserLoginResponseDto()
        {
            Id = user.Id.ToString(),
            JwtToken = manager.CreateJwt(user)
        };
    }
}