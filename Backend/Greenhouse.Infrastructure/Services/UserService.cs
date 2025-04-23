using API.Exceptions;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.User;
using Greenhouse.DataAccess;
using Greenhouse.DataAccess.Repositories;
using Greenhouse.Domain;
using Microsoft.AspNetCore.Identity;
using Service.TransferModels.Responses;

namespace Greenhouse.Infrastructure.Services;

public class UserService(IPasswordHasher<User> passwordHasher, IJwtManager jwtManager, IUserRepository userRepository)
    : IUserService
{
    public UserSignupResponseDto SignUp(UserSignupDto request)
    {
        Guid userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Name = request.Name,
            Role = UserRole.USER
        };
        user.Passwordhash = passwordHasher.HashPassword(user, request.Password);
        
        userRepository.CreateUser(user);
        return UserSignupResponseDto.FromEntity(user, jwtManager);
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
        
        return UserLoginResponseDto.FromEntity(user, jwtManager);
    }
}