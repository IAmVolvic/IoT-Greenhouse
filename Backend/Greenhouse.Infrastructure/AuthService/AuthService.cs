using API.Exceptions;
using Greenhouse.Application.Security;
using Greenhouse.Domain;
using Greenhouse.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Service.Services.Interfaces;
using Service.TransferModels.Responses;

namespace Service.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _repository;
    private readonly IJwtManager _jwtManager;
    
    public AuthService(IPasswordHasher<User> passwordHasher, IJwtManager jwtManager, AppDbContext userRepository)
    {
        _repository = userRepository;
        _jwtManager = jwtManager;
    }
    
    public async Task<AuthorizedUserResponseDTO> GetAuthorizedUser(string jwtToken)
    {
        var jwtData = _jwtManager.IsJWTValid(jwtToken);
        var uuidClaim = jwtData.Claims.FirstOrDefault(claim => claim.Type == "uuid");
        var userData = await _repository.Users.FindAsync(Guid.Parse(uuidClaim.Value));
        
        if (userData == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return AuthorizedUserResponseDTO.FromEntity(userData);
    }
    

    public void IsUserAuthenticated(string jwtToken)
    {
        var jwtData = _jwtManager.IsJWTValid(jwtToken);
    
        if (jwtData == null)
        {
            throw new ErrorException("Authentication", "Authentication failed due to invalid token");
        }
    }

    
    public async void IsUserAuthorized(string[] roles, string jwtToken)
    {
        var userData = await GetAuthorizedUser(jwtToken);

        if (!roles.Contains(userData.Role.ToString()))
        {
            throw new ErrorException("Authorization", "User does not have the required role.");
        }
    }
    
    public void SignUp(){}
    
    public void Login(){}
}
