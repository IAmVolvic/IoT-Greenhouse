using Greenhouse.API.Attributes;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.FeatureToggle;
using Greenhouse.Application.Services.User;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]/@user")]
public class AuthController(IUserService userService, IFeatureToggleService featureToggleService) : ControllerBase
{
    [HttpGet]
    [Route("")]
    [Authenticated]
    public ActionResult<AuthorizedUserResponseDto> GetUser()
    {
        if (featureToggleService.IsEnabled("feature_login") && featureToggleService.IsEnabled("feature_signup"))
        {
            var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
            return Ok(authUser);
        }
        else
        {
            return Unauthorized();
        }
    }
    
    [HttpPost]
    [Route("login")]
    public ActionResult<UserLoginResponseDto> PLogin([FromBody] UserLoginDto request)
    {
        if (featureToggleService.IsEnabled("feature_login"))
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
        else
        {
            return Unauthorized();
        }
    }
    
    [HttpPost]
    [Route("signup")]
    public ActionResult<UserSignupResponseDto> PSignup([FromBody] UserSignupDto request)
    {
        if (featureToggleService.IsEnabled("feature_signup"))
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
        else
        {
            return Unauthorized();
        }
    }
}