using API.Attributes;
using Greenhouse.Application;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    private readonly IHelloService _helloService;
    
    public HelloController(IHelloService helloService)
    {
        _helloService = helloService;
    }

    [HttpGet]
    [Authenticated]
    public async Task<IActionResult> Get()
    {
        var response = await _helloService.GetHelloAsync();
        return Ok(response);
    }
}