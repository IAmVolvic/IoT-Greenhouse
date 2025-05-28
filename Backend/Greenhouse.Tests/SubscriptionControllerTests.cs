using System.Net;
using System.Net.Http.Json;
using Greenhouse.API;
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
    public async Task SubscribeToSpecificTopic_Subscribes_To_Specific_Topic()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        
        
        var connManager = _scopedServiceProvider.GetRequiredService<IConnectionManager>();

        var subscribeToTopicDto = new SubscirbeToTopicDto
        {
            UserId = 123,
            TopicNames = new List<string> { "Topic1" }
        };
        
        var response = await _httpClient.PostAsJsonAsync("Subscription/Subscribe/SpecificTopics",subscribeToTopicDto);
        
        var membersAtTopic = await connManager.GetMembersFromTopicId("Topic1");
        var memberIds = membersAtTopic.Select(int.Parse).ToList();
        Assert.Multiple(() =>
        {
            Assert.That(response.IsSuccessStatusCode, Is.True, "Subscription request failed");

            Assert.That(memberIds, Is.Not.Null, "No members found for topic");
        });
        Assert.That(memberIds, Does.Contain(123), "User not subscribed to the topic");

        Assert.That(memberIds, Has.Count.EqualTo(1), "Unexpected number of members in the topic");
    }
    
    [Test]
    public async Task SubscribeToYourDevices_Subscribes_To_Your_Devices()
    {
        await ApiTestBase.TestRegisterAndSetAuthCookie(_httpClient);
        
        
        var connManager = _scopedServiceProvider.GetRequiredService<IConnectionManager>();

        var subscribeToTopicDto = new SubscirbeToTopicDto
        {
            UserId = 123,
            TopicNames = new List<string> { "Topic1" }
        };
        
        var response = await _httpClient.PostAsJsonAsync("Subscription/Subscribe/SpecificTopics",subscribeToTopicDto);
        
        var membersAtTopic = await connManager.GetMembersFromTopicId("Topic1");
        var memberIds = membersAtTopic.Select(int.Parse).ToList();
        Assert.Multiple(() =>
        {
            Assert.That(response.IsSuccessStatusCode, Is.True, "Subscription request failed");

            Assert.That(memberIds, Is.Not.Null, "No members found for topic");
        });
        
        Assert.That(memberIds, Does.Contain(123), "User not subscribed to the topic");
        Assert.That(memberIds, Has.Count.EqualTo(1), "Unexpected number of members in the topic");
    }
}