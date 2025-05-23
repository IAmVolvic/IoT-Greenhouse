using System.Net.Http.Json;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.Device.Requests;
using Greenhouse.Domain.DatabaseDtos;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class DeviceControllerTests
{
    private HttpClient _httpClient;
    private IServiceProvider _scopedServiceProvider;

    [SetUp]
    public void Setup()
    {
        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services => { services.DefaultTestConfig(); });
            });

        _httpClient = factory.CreateClient();
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
        // Arrange
        await ApiTestBase.TestRegisterAndAddJwt(_httpClient);
        var assignDto = new DeviceAssignDto
        {
            DeviceId = Guid.NewGuid(),
            DeviceName = "Test Device"
        };

        // Act
        var response = await _httpClient.PostAsJsonAsync("Device/AssignDeviceToUser", assignDto);
        var body = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Response body: " + body);
        Console.WriteLine("Status Code: " + response.StatusCode);
        Assert.That(response.IsSuccessStatusCode, Is.True, "Request failed with status: " + response.StatusCode);

        // Assert
        Assert.That(response.IsSuccessStatusCode, Is.True);
        var result = await response.Content.ReadFromJsonAsync<DeviceResponseDto>();
        Assert.That(result, Is.Not.Null);
        Assert.That(result.DeviceName, Is.EqualTo(assignDto.DeviceName));
    }

    [Test]
    public async Task ChangePreferences_ShouldReturnOk()
    {
        await ApiTestBase.TestRegisterAndAddJwt(_httpClient);
        var dto = new PreferencesChangeDto
        {
            DeviceId = Guid.NewGuid(),
            SensorInterval = 600
        };

        var response = await _httpClient.PatchAsJsonAsync("Device/Preferences/ChangePreferences", dto);

        Assert.That(response.IsSuccessStatusCode, Is.True);
    }

    [Test]
    public async Task ChangeDeviceName_ShouldReturnOk()
    {
        await ApiTestBase.TestRegisterAndAddJwt(_httpClient);
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
        await ApiTestBase.TestRegisterAndAddJwt(_httpClient);
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
        await ApiTestBase.TestRegisterAndAddJwt(_httpClient);

        var response = await _httpClient.GetAsync("Device/MyDevices");

        Assert.That(response.IsSuccessStatusCode, Is.True);
        var devices = await response.Content.ReadFromJsonAsync<List<DeviceResponseDto>>();
        Assert.That(devices, Is.Not.Null);
    }

    [Test]
    public async Task UnassignedDevices_ShouldReturnDeviceList()
    {
        await ApiTestBase.TestRegisterAndAddJwt(_httpClient);

        var response = await _httpClient.GetAsync("Device/UnassignedDevices");

        Assert.That(response.IsSuccessStatusCode, Is.True);
        var devices = await response.Content.ReadFromJsonAsync<List<UnassignedDevice>>();
        Assert.That(devices, Is.Not.Null);
    }
}
