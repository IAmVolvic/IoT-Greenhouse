using Greenhouse.API.Attributes;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.User;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]/@user")]
public class AuthController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [Route("")]
    [Authenticated]
    public ActionResult<AuthorizedUserResponseDto> GetUser()
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
        return Ok(authUser);
    }
    
    [HttpPost]
    [Route("login")]
    public ActionResult<UserLoginResponseDto> PLogin([FromBody] UserLoginDto request)
    {
        var loginResponse = userService.Login(request);

        Response.Cookies.Append("Authentication", loginResponse.JwtToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(new { message = "Login successful" });
    }
    
    [HttpPost]
    [Route("signup")]
    public ActionResult<UserSignupResponseDto> PSignup([FromBody] UserSignupDto request)
    {
        var signupResponse = userService.SignUp(request);

        Response.Cookies.Append("Authentication", signupResponse.JwtToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(new { message = "Signup successful" });
    }
}