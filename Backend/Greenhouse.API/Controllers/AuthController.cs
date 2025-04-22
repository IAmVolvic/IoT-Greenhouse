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
        if (!ModelState.IsValid)
        {
            return new BadRequestObjectResult(ModelState);
        }
        
        return new OkObjectResult("Ok");
    }
    
    [HttpPost]
    [Route("login")]
    public ActionResult<UserLoginResponseDto> PLogin([FromBody] UserLoginDto request)
    {
        return Ok(userService.Login());
    }
    
    [HttpPost]
    [Route("signup")]
    public ActionResult<UserSignupResponseDto> PSignup([FromBody] UserSignupDto request)
    {
        return Ok(userService.SignUp(request));
    }
}