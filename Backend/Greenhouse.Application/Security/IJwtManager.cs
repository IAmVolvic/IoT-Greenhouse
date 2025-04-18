using System.Security.Claims;

namespace Greenhouse.Application.Security;

public interface IJwtManager
{
    public string CreateJWT(UserDto user);
    public ClaimsPrincipal IsJWTValid(string token);
}