using Greenhouse.API.Attributes;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.Device;
using Greenhouse.Domain.DatabaseDtos;
using Microsoft.AspNetCore.Mvc;

namespace Greenhouse.API.Controllers;

[ApiController]
[Route("[controller]")]
public class DeviceController(IDeviceService deviceService) : ControllerBase
{
    [HttpPost]
    [Route("AssignDeviceToUser")]
    [Authenticated]
    public async Task<ActionResult> Post([FromBody] DeviceAssignDto deviceDto)
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
        var device = await deviceService.AssignDeviceToUser(authUser.Id, deviceDto.DeviceId, deviceDto.DeviceName);
        return Ok(device);
    }

    [HttpPatch]
    [Route("Preferences/ChangePreferences")]
    [Authenticated]
    public async Task<ActionResult> ChangePreferences([FromBody] PreferencesChangeDto preferencesDto)
    {
        await deviceService.UpdatePreferences(preferencesDto);
        return Ok();
    }
}