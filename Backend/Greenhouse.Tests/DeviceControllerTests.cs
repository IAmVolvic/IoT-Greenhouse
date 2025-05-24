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
    private WebApplicationFactory<Program> _factory;
    [SetUp]
    public void Setup()
    {
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.DefaultTestConfig();
                });
            });

        _httpClient = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("http://localhost")
        });

        _scopedServiceProvider = _factory.Services.CreateScope().ServiceProvider;
    }



    [TearDown]
    public void TearDown()
    {
        _httpClient?.Dispose();
        (_scopedServiceProvider as IDisposable)?.Dispose();
        _factory?.Dispose();
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
        var userInfo = await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var dbContext = _scopedServiceProvider.GetService<AppDbContext>();
        var deviceId = Guid.NewGuid();
        var device = new Device()
        {
            Id = deviceId,
            DeviceName = "Test Device",
            UserId = Guid.Parse(userInfo.UserId)
        };
        await dbContext.Devices.AddAsync(device);
        await dbContext.SaveChangesAsync();
        var dto = new ChangeDeviceNameDto
        {
            DeviceId = deviceId,
            DeviceName = "Updated Device Name"
        };

        var response = await _httpClient.PatchAsJsonAsync("Device/ChangeDeviceName", dto);
        
        dbContext.Entry(device).State = EntityState.Detached;
        
        var deviceInDb = await dbContext.Devices
            .Where(p => p.Id == deviceId)
            .FirstOrDefaultAsync();
        Assert.That(response.IsSuccessStatusCode, Is.True);
        Assert.That(deviceInDb, Is.Not.Null);
        Assert.That(deviceInDb.DeviceName, Is.EqualTo(dto.DeviceName));
    }

    [Test]
    public async Task RemoveDeviceFromUser_ShouldReturnOk()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var userInfo = await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var dbContext = _scopedServiceProvider.GetService<AppDbContext>();

        var deviceId = Guid.NewGuid();
        var device = new Device()
        {
            Id = deviceId,
            DeviceName = "Test Device",
            UserId = Guid.Parse(userInfo.UserId)
        };
        await dbContext.Devices.AddAsync(device);
        await dbContext.SaveChangesAsync();

        var response = await _httpClient.SendAsync(new HttpRequestMessage
        {
            Method = HttpMethod.Delete,
            RequestUri = new Uri("Device/RemoveDeviceFromUser", UriKind.Relative),
            Content = JsonContent.Create(deviceId)
        });

        dbContext.Entry(device).State = EntityState.Detached;

        var deviceInDb = await dbContext.Devices
            .Where(p => p.Id == deviceId)
            .FirstOrDefaultAsync();

        Assert.That(response.IsSuccessStatusCode, Is.True);
        Assert.That(deviceInDb, Is.Null);
    }

    [Test]
    public async Task MyDevices_ShouldReturnDeviceList()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var userInfo = await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var dbContext = _scopedServiceProvider.GetService<AppDbContext>();

        var userId = Guid.Parse(userInfo.UserId);

        var deviceId1 = Guid.NewGuid();
        var device1 = new Device()
        {
            Id = deviceId1,
            DeviceName = "Test Device 1",
            UserId = userId
        };
        var deviceId2 = Guid.NewGuid();
        var device2 = new Device()
        {
            Id = deviceId2,
            DeviceName = "Test Device 2",
            UserId = userId
        };

        await dbContext.Devices.AddRangeAsync(device1, device2);
        await dbContext.SaveChangesAsync();

        var response = await _httpClient.GetAsync("Device/MyDevices");

        Assert.That(response.IsSuccessStatusCode, Is.True);

        var devices = await response.Content.ReadFromJsonAsync<List<DeviceResponseDto>>();

        Assert.That(devices, Is.Not.Null);
        Assert.That(devices.Count, Is.EqualTo(2));

        var deviceIds = devices.Select(d => d.Id).ToList();
        Assert.That(deviceIds, Does.Contain(deviceId1));
        Assert.That(deviceIds, Does.Contain(deviceId2));

        var names = devices.Select(d => d.DeviceName).ToList();
        Assert.That(names, Does.Contain("Test Device 1"));
        Assert.That(names, Does.Contain("Test Device 2"));
    }


    [Test]
    public async Task UnassignedDevices_ShouldReturnDeviceList()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var userInfo = await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        var dbContext = _scopedServiceProvider.GetService<AppDbContext>();

        var userId = Guid.Parse(userInfo.UserId);

        var deviceId1 = Guid.NewGuid();
        var device1 = new UnassignedDevice()
        {
            Id = deviceId1,
        };
        var deviceId2 = Guid.NewGuid();
        var device2 = new UnassignedDevice()
        {
            Id = deviceId2
        };

        await dbContext.UnassignedDevices.AddRangeAsync(device1, device2);
        await dbContext.SaveChangesAsync();
        var response = await _httpClient.GetAsync("Device/UnassignedDevices");

        Assert.That(response.IsSuccessStatusCode, Is.True);
        var devices = await response.Content.ReadFromJsonAsync<List<UnassignedDevice>>();
        Assert.That(devices, Is.Not.Null, "Returned device list should not be null");
        Assert.That(devices, Has.Count.EqualTo(2), "Returned device list should contain exactly 2 devices");

        // Check that the returned devices contain the devices we added
        Assert.That(devices.Any(d => d.Id == deviceId1), Is.True, "Device 1 should be in the returned list");
        Assert.That(devices.Any(d => d.Id == deviceId2), Is.True, "Device 2 should be in the returned list");

    }
}
