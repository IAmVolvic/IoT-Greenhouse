using API.Attributes;
using Greenhouse.Application;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]")]
public class HelloController : ControllerBase
{
    private readonly IHelloService _helloService;
    
    public HelloController(IHelloService helloService)
    {
        _helloService = helloService;
    }

    [HttpGet]
    [Route("HelloWorld")]
    public async Task<IActionResult> HelloWorld()
    {
        var response = await _helloService.GetHelloAsync();
        return Ok(response);
    }
}