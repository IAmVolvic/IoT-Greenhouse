using System.Security.Claims;
using Greenhouse.Domain.DatabaseDtos;

namespace Greenhouse.Application.Security;

public interface IJwtManager
{
    public string CreateJwt(User user);
    public ClaimsPrincipal IsJwtValid(string token);
}