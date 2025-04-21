using API.Attributes;
using Greenhouse.Application.Security.Requests;
using Microsoft.AspNetCore.Mvc;
using Service.TransferModels.Responses;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]/@user")]
public class AuthController : ControllerBase
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
    public ActionResult<UserLoginResponseDto> PLogin([FromBody] UserLoginDto data)
    {
        return Ok("OK");
    }
    
    [HttpPost]
    [Route("signup")]
    public ActionResult<UserSignupResponseDto> PSignup([FromBody] UserSignupDto request)
    {
        return Ok("OK");
    }
}