using Greenhouse.API.Attributes;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.Device;
using Greenhouse.Application.Services.Device.Requests;
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
        var preferences = await deviceService.UpdatePreferences(preferencesDto);
        return Ok(preferences);
    }
    
    [HttpPatch]
    [Route("ChangeDeviceName")]
    [Authenticated]
    public Task<ActionResult> ChangeDeviceName([FromBody] ChangeDeviceNameDto changeDeviceNameDto)
    {
        deviceService.UpdateDeviceName(changeDeviceNameDto);
        return Task.FromResult<ActionResult>(Ok());
    }

    [HttpDelete]
    [Route("RemoveDeviceFromUser")]
    [Authenticated]
    public async Task<ActionResult> RemoveDeviceFromUser([FromBody] Guid deviceId)
    {
        await deviceService.RemoveDeviceFromUser(deviceId);
        return Ok();
    }
    

    [HttpGet]
    [Route("MyDevices")]
    [Authenticated]
    public ActionResult<List<DeviceResponseDto>> MyDevices()
    {
        var authUser = HttpContext.Items["AuthenticatedUser"] as AuthorizedUserResponseDto;
        var devices = deviceService.UserDevices(authUser.Id);
        return Ok(devices);
    }
    
    [HttpGet]
    [Route("UnassignedDevices")]
    [Authenticated]
    public ActionResult<List<UnassignedDevice>> UnassignedDevices()
    {
        var devices = deviceService.GetUnassignedDevices();
        return Ok(devices);
    }
}