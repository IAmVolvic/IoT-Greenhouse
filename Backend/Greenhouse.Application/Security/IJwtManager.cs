using System.Security.Claims;
using Greenhouse.Domain;

namespace Greenhouse.Application.Security;

public interface IJwtManager
{
    public string CreateJWT(User user);
    public ClaimsPrincipal IsJWTValid(string token);
}