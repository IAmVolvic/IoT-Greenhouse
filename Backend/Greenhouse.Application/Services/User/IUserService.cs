using Greenhouse.Application.Security.Requests;

namespace Greenhouse.Application.Services.User;

public interface IUserService
{
    public UserSignupResponseDto SignUp();
    public UserLoginResponseDto Login();
}