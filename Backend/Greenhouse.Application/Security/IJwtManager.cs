using System.Security.Claims;
using Greenhouse.Domain;

namespace Greenhouse.Application.Security;

public interface IJwtManager
{
    public string CreateJwt(User user);
    public ClaimsPrincipal IsJwtValid(string token);
}