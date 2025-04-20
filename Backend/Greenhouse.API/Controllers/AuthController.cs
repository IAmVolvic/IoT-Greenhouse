using API.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet]
    [Route("@user")]
    [Authenticated]
    public ActionResult<string> GetUser()
    {
        if (!ModelState.IsValid)
        {
            return new BadRequestObjectResult(ModelState);
        }
        
        return new OkObjectResult("Ok");
    }
}