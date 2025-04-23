using API.Attributes;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.User;
using Microsoft.AspNetCore.Mvc;
using Service.TransferModels.Responses;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]/@user")]
public class AuthController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [Route("")]
    [Authenticated]
    public ActionResult<AuthorizedUserResponseDTO> GetUser()
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDTO;
        return Ok(authUser);
    }
    
    [HttpPost]
    [Route("login")]
    public ActionResult<UserLoginResponseDto> PLogin([FromBody] UserLoginDto request)
    {
        return Ok(userService.Login(request));
    }
    
    [HttpPost]
    [Route("signup")]
    public ActionResult<UserSignupResponseDto> PSignup([FromBody] UserSignupDto request)
    {
        return Ok(userService.SignUp(request));
    }
}