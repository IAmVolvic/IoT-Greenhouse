using API.Attributes;
using Application.Services.User;
using Greenhouse.Application.Security.Requests;
using Microsoft.AspNetCore.Mvc;
using Service.TransferModels.Responses;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]/@user")]
public class AuthController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

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
    public ActionResult<UserLoginResponseDto> PLogin([FromBody] UserLoginDto data)
    {
        return Ok(_userService.Login());
    }
    
    [HttpPost]
    [Route("signup")]
    public ActionResult<UserSignupResponseDto> PSignup([FromBody] UserSignupDto request)
    {
        return Ok("OK");
    }
}