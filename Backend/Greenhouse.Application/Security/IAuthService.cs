using Greenhouse.Application.Security.Requests;

namespace Greenhouse.Application.Security;

public interface IAuthService
{
    public AuthorizedUserResponseDto GetAuthorizedUser(string jwtToken);
    public void IsUserAuthenticated(string jwtToken);
    public void IsUserAuthorized(string[] roles, string jwtToken);
}