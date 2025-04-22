using API.Exceptions;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.User;
using Greenhouse.Domain;
using Microsoft.AspNetCore.Identity;
using Service.TransferModels.Responses;

namespace Greenhouse.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _repository;
    private readonly IJwtManager _jwtManager;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserService(IPasswordHasher<User> passwordHasher, IJwtManager jwtManager, AppDbContext userRepository)
    {
        _repository = userRepository;
        _jwtManager = jwtManager;
        _passwordHasher  = passwordHasher;
    }


    public UserSignupResponseDto SignUp(UserSignupDto request)
    {
        Guid userId = Guid.NewGuid();
       
        if (_repository.Users.Any(u => u.Name == request.Name))
        {
            throw new ErrorException("User", "A user with this name already exists.");
        }
        
        var user = new User
        {
            Id = userId,
            Name = request.Name,
            Role = UserRole.USER
        };
        user.Passwordhash = _passwordHasher.HashPassword(user, request.Password);
        
        _repository.Users.Add(user);
        _repository.SaveChangesAsync();
        return UserSignupResponseDto.FromEntity(user, _jwtManager);
    }

    public UserLoginResponseDto Login()
    {
        Guid userId = Guid.NewGuid();
        
        var user = new User
        {
            Id = userId,
            Name = "John Doe",
            Passwordhash = "password",
            Role = UserRole.USER
        };
        
        return UserLoginResponseDto.FromEntity(user, _jwtManager);
    }

    private AuthorizedUserResponseDTO GetUserByName(string username)
    {
        var user = _repository.Users.FirstOrDefault(u => u.Name == username);
        if (user == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return AuthorizedUserResponseDTO.FromEntity(user);
    }
    
    private AuthorizedUserResponseDTO GetUserById(Guid userId)
    {
        var user = _repository.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return AuthorizedUserResponseDTO.FromEntity(user);
    }
}