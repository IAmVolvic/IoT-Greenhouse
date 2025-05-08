using Greenhouse.API.Attributes;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.Device;
using Greenhouse.Application.Websocket.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]")]
public class SubscriptionController(IWebsocketSubscriptionService websocketSubscriptionService, IDeviceService deviceService) : ControllerBase
{
    [HttpPost]
    [Route("Subscribe")]
    [Authenticated]
    public async Task<ActionResult> Subscribe([FromBody] int socketId)
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
        var userDevices = deviceService.GetDevicesForUser(authUser.Id);
        await websocketSubscriptionService.SubscribeToTopic(socketId.ToString(), userDevices.Select(d => d.Id.ToString()).ToList());
        return Ok();
    }
    
    
    [HttpPost]
    [Route("SubscribeTest")]
    [Authenticated]
    public async Task<ActionResult> SubscribeTest([FromBody] int socketId)
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
        await websocketSubscriptionService.SubscribeToTopic(socketId.ToString(), new List<string>());
        return Ok();
    }
}