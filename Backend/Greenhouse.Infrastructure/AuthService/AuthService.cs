using Greenhouse.Application.Exceptions;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;

namespace Greenhouse.Infrastructure.AuthService;

public class AuthService : IAuthService
{
    private readonly IUserRepository _repository;
    private readonly IJwtManager _jwtManager;
    
    public AuthService(IJwtManager jwtManager, IUserRepository userRepository)
    {
        _repository = userRepository;
        _jwtManager = jwtManager;
    }
    
    public AuthorizedUserResponseDto GetAuthorizedUser(string jwtToken)
    {
        var jwtData = _jwtManager.IsJwtValid(jwtToken);
        var uuidClaim = jwtData.Claims.FirstOrDefault(claim => claim.Type == "uuid");
        var userData = _repository.GetUserById(Guid.Parse(uuidClaim.Value));
        
        return AuthorizedUserResponseDto.FromEntity(userData);
    }
    

    public void IsUserAuthenticated(string jwtToken)
    {
        var jwtData = _jwtManager.IsJwtValid(jwtToken);
    
        if (jwtData == null)
        {
            throw new ErrorException("Authentication", "Authentication failed due to invalid token");
        }
    }

    
    public void IsUserAuthorized(string[] roles, string jwtToken)
    {
        var userData = GetAuthorizedUser(jwtToken);

        if (!roles.Contains(userData.Role.ToString()))
        {
            throw new ErrorException("Authorization", "User does not have the required role.");
        }
    }
}
