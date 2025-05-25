using System.Net;
using System.Net.Http.Json;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Websocket.Interfaces;
using HiveMQtt.Client;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic.CompilerServices;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class SubscriptionControllerTests
{
    private HttpClient _httpClient;
    private IServiceProvider _scopedServiceProvider;
    private CookieContainer _cookieContainer;
    private WebApplicationFactory<Program> _factory;
    private HiveMQClient _hiveMQClient;
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
        _hiveMQClient = _scopedServiceProvider.GetRequiredService<HiveMQClient>();
    }
    
    
    [TearDown]
    public async void TearDown()
    {
        _httpClient?.Dispose();
        (_scopedServiceProvider as IDisposable)?.Dispose();
        _factory?.Dispose();
        if (_hiveMQClient != null)
        {
            await _hiveMQClient.DisconnectAsync();
            _hiveMQClient.Dispose();
        }
    }

    [Test]
    public async Task SubscribeToSpecificTopic_Subscribes_To_Specific_Topic()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        
        var wsClient1 = _scopedServiceProvider.GetRequiredService<TestWsClient>();
        
        var connManager = _scopedServiceProvider.GetRequiredService<IConnectionManager>();

        var subscribeToTopicDto = new SubscirbeToTopicDto
        {
            userId = int.Parse(wsClient1.WsClientId),
            TopicNames = new List<string> { "Topic1" }
        };
        
        var response = await _httpClient.PostAsJsonAsync("Subscription/Subscribe/SpecificTopics",subscribeToTopicDto);
        
        var membersAtTopic = await connManager.GetMembersFromTopicId("Topic1");
        
        Assert.That(response.IsSuccessStatusCode, Is.True, "Subscription request failed");

        Assert.That(membersAtTopic, Is.Not.Null, "No members found for topic");
        Assert.That(membersAtTopic, Does.Contain(wsClient1.WsClientId), "User not subscribed to the topic");

        Assert.That(membersAtTopic.Count, Is.EqualTo(1), "Unexpected number of members in the topic");
    }
}