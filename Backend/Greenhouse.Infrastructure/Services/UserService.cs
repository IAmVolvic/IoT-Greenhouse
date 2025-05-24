using System.ComponentModel.DataAnnotations;
using Greenhouse.Application.Exceptions;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.User;
using Greenhouse.Domain;
using Greenhouse.Domain.DatabaseDtos;
using Microsoft.AspNetCore.Identity;

namespace Greenhouse.Infrastructure.Services;

public class UserService(IPasswordHasher<User> passwordHasher, IJwtManager jwtManager, IUserRepository userRepository)
    : IUserService
{
    public UserSignupResponseDto SignUp(UserSignupDto request)
    {
        // Check if context is valid
        var context = new ValidationContext(request);
        Validator.ValidateObject(request, context, true);
        
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

    public UserLoginResponseDto Login(UserLoginDto request)
    {
        var userFromDb =  userRepository.GetUserByName(request.Name);
        
        if (passwordHasher.VerifyHashedPassword(userFromDb, userFromDb.Passwordhash, request.Password) ==
            PasswordVerificationResult.Failed)
        {
            MonitorService.log.Error("Invalid password");
            throw new ErrorException("Password", "Password does not match");
        }
        
        return UserLoginResponseDto.FromEntity(userFromDb, jwtManager);
    }
}