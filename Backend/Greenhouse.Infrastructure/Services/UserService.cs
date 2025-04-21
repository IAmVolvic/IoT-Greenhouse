using Application.Services.User;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Domain;
using Microsoft.AspNetCore.Identity;

namespace Greenhouse.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _repository;
    private readonly IJwtManager _jwtManager;

    public UserService(IPasswordHasher<User> passwordHasher, IJwtManager jwtManager, AppDbContext userRepository)
    {
        _repository = userRepository;
        _jwtManager = jwtManager;
    }
    
    
    public void SignUp(){}

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
}