using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Security.Requests;

public class UserSignupResponseDto
{
    public string Id { get; set; } = null!;
    
    public string JwtToken { get; set; } = null!;

    public static UserSignupResponseDto FromEntity(User user, IJwtManager manager)
    {
        return new UserSignupResponseDto()
        {
            Id = user.Id.ToString(),
            JwtToken = manager.CreateJwt(user)
        };
    }
}