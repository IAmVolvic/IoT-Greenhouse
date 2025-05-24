using System.Net;
using System.Net.Http.Json;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.Device.Requests;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class DeviceControllerTests
{
    private HttpClient _httpClient;
    private IServiceProvider _scopedServiceProvider;
    private CookieContainer _cookieContainer;
    [SetUp]
    public void Setup()
    {
        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.DefaultTestConfig();
                });
            });

        _httpClient = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("http://localhost")
        });

        _scopedServiceProvider = factory.Services.CreateScope().ServiceProvider;
    }



    [TearDown]
    public void TearDown()
    {
        _httpClient?.Dispose();
    }

    [Test]
    public async Task AssignDeviceToUser_ShouldReturnOkWithDevice()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);

        var assignDto = new DeviceAssignDto
        {
            DeviceId = Guid.NewGuid(),
            DeviceName = "Test Device"
        };

        var response = await _httpClient.PostAsJsonAsync("Device/AssignDeviceToUser", assignDto);
        var result = await response.Content.ReadFromJsonAsync<DeviceResponseDto>();
        var body = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Response body: " + body);
        Console.WriteLine("Status Code: " + response.StatusCode);
        Assert.That(response.IsSuccessStatusCode, Is.True, "Request failed with status: " + body);
        Assert.That(response.IsSuccessStatusCode, Is.True);
        Assert.That(result, Is.Not.Null);
        Assert.That(result.DeviceName, Is.EqualTo(assignDto.DeviceName));
    }

    [Test]
    public async Task ChangePreferences_ShouldReturnOk()
    {
        var userInfo = await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var dbContext = _scopedServiceProvider.GetService<AppDbContext>();
        var deviceId = Guid.NewGuid();
        var device = new Device()
        {
            Id = deviceId,
            DeviceName = "Test Device",
            UserId = Guid.Parse(userInfo.UserId)
        };
        var preferenceId = Guid.NewGuid();
        var preference = new Preferences()
        {
            DeviceId = deviceId,
            SensorInterval = 1000,
            Id = preferenceId,
        };
        await dbContext.Devices.AddAsync(device);
        await dbContext.Preferences.AddAsync(preference);
        await dbContext.SaveChangesAsync();
        var dto = new PreferencesChangeDto
        {
            DeviceId = deviceId,
            SensorInterval = 600
        };

        var response = await _httpClient.PatchAsJsonAsync("Device/Preferences/ChangePreferences", dto);
        var result = await response.Content.ReadFromJsonAsync<Preferences>();
        dbContext.Entry(preference).State = EntityState.Detached;
        var prefFromDb = await dbContext.Preferences
            .Where(p => p.Id == preferenceId)
            .FirstOrDefaultAsync();
        Assert.That(response.IsSuccessStatusCode, Is.True);
        Assert.That(prefFromDb, Is.Not.Null);
        Assert.That(prefFromDb.DeviceId, Is.EqualTo(deviceId));
        Assert.That(prefFromDb.SensorInterval, Is.EqualTo(600));
    }

    [Test]
    public async Task ChangeDeviceName_ShouldReturnOk()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var dto = new ChangeDeviceNameDto
        {
            DeviceId = Guid.NewGuid(),
            DeviceName = "Updated Device Name"
        };

        var response = await _httpClient.PatchAsJsonAsync("Device/ChangeDeviceName", dto);

        Assert.That(response.IsSuccessStatusCode, Is.True);
    }

    [Test]
    public async Task RemoveDeviceFromUser_ShouldReturnOk()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var deviceId = Guid.NewGuid();

        var response = await _httpClient.SendAsync(new HttpRequestMessage
        {
            Method = HttpMethod.Delete,
            RequestUri = new Uri("Device/RemoveDeviceFromUser", UriKind.Relative),
            Content = JsonContent.Create(deviceId)
        });

        Assert.That(response.IsSuccessStatusCode, Is.True);
    }

    [Test]
    public async Task MyDevices_ShouldReturnDeviceList()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);

        var response = await _httpClient.GetAsync("Device/MyDevices");

        Assert.That(response.IsSuccessStatusCode, Is.True);
        var devices = await response.Content.ReadFromJsonAsync<List<DeviceResponseDto>>();
        Assert.That(devices, Is.Not.Null);
    }

    [Test]
    public async Task UnassignedDevices_ShouldReturnDeviceList()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);

        var response = await _httpClient.GetAsync("Device/UnassignedDevices");

        Assert.That(response.IsSuccessStatusCode, Is.True);
        var devices = await response.Content.ReadFromJsonAsync<List<UnassignedDevice>>();
        Assert.That(devices, Is.Not.Null);
    }
}
