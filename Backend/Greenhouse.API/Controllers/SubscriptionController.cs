using Greenhouse.API.Attributes;
using Greenhouse.API.FrontendDtos;
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
    [Route("Subscribe/YourDevices")]
    [Authenticated]
    public async Task<ActionResult> SubscribeToDevices([FromBody] int socketId)
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
        var userDevices = deviceService.GetDevicesForUser(authUser.Id);
        await websocketSubscriptionService.SubscribeToTopic(socketId.ToString(), userDevices.Select(d => d.Id.ToString()).ToList());
        return Ok();
    }
    
    [HttpPost]
    [Route("Subscribe/SpecificTopics")]
    [Authenticated]
    public async Task<ActionResult> SubscribeToSpecificTopics([FromBody] SubscirbeToTopicDto topicInfo)
    {
        await websocketSubscriptionService.SubscribeToTopic(topicInfo.userId.ToString(), topicInfo.TopicNames.ToList());
        return Ok();
    }
}