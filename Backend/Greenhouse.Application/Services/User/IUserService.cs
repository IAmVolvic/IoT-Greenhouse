using Greenhouse.Application.Security.Requests;

namespace Application.Services.User;

public interface IUserService
{
    public void SignUp();
    public UserLoginResponseDto Login();
}