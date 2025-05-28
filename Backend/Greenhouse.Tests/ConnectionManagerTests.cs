using Fleck;
using Greenhouse.Infrastructure.WebsocketServices;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class WebSocketConnectionManagerTests
{
    private WebSocketConnectionManager _manager;
    private Mock<ILogger<WebSocketConnectionManager>> _loggerMock;
    private Mock<IWebSocketConnection> _socketMock;

    [SetUp]
    public void Setup()
    {
        _loggerMock = new Mock<ILogger<WebSocketConnectionManager>>();
        _manager = new WebSocketConnectionManager(_loggerMock.Object);
        
        _socketMock = new Mock<IWebSocketConnection>();
        _socketMock.Setup(s => s.IsAvailable).Returns(true);
        _socketMock.Setup(s => s.Send(It.IsAny<string>())).Returns(Task.CompletedTask);
        _socketMock.Setup(s => s.ConnectionInfo.Id).Returns(Guid.NewGuid());
    }

    [Test]
    public async Task OnOpen_RegistersClient_AndReplacesOldConnection()
    {
        string clientId = "client123";

        // First connection
        await _manager.OnOpen(_socketMock.Object, clientId);

        var socketFromManager = _manager.GetSocketFromClientId(clientId);
        Assert.That(socketFromManager, Is.EqualTo(_socketMock.Object));

        // Second connection with same clientId should replace the old one
        var newSocketMock = new Mock<IWebSocketConnection>();
        newSocketMock.Setup(s => s.IsAvailable).Returns(true);
        newSocketMock.Setup(s => s.Send(It.IsAny<string>())).Returns(Task.CompletedTask);
        newSocketMock.Setup(s => s.ConnectionInfo.Id).Returns(Guid.NewGuid());

        await _manager.OnOpen(newSocketMock.Object, clientId);

        var newSocketFromManager = _manager.GetSocketFromClientId(clientId);
        Assert.That(newSocketFromManager, Is.EqualTo(newSocketMock.Object));
    }

    [Test]
    public async Task AddToTopic_AddsClientToTopic()
    {
        string clientId = "user456";
        string topic = "TopicA";

        await _manager.AddToTopic(topic, clientId);

        var members = await _manager.GetMembersFromTopicId(topic);
        Assert.That(members, Does.Contain(clientId));
    }

    [Test]
    public async Task RemoveFromTopic_RemovesClientProperly()
    {
        string clientId = "user789";
        string topic = "TopicB";

        await _manager.AddToTopic(topic, clientId);
        await _manager.RemoveFromTopic(topic, clientId);

        var members = await _manager.GetMembersFromTopicId(topic);
        Assert.That(members, Does.Not.Contain(clientId));
        Assert.That(members.Count, Is.EqualTo(0));
    }

    [Test]
    public async Task BroadcastToTopic_SendsMessagesToAllAvailableClients()
    {
        string clientId = "broadcaster";
        string topic = "BroadcastTopic";

        await _manager.OnOpen(_socketMock.Object, clientId);
        await _manager.AddToTopic(topic, clientId);

        var message = new { Text = "Hello World" };
        await _manager.BroadcastToTopic(topic, message);

        _socketMock.Verify(s =>
            s.Send(It.Is<string>(json => json.Contains("hello world", StringComparison.OrdinalIgnoreCase) || json.Contains("text", StringComparison.OrdinalIgnoreCase))),
            Times.Once);
    }

    [Test]
    public async Task OnClose_RemovesClientMapping()
    {
        string clientId = "closer";
        var connectionId = _socketMock.Object.ConnectionInfo.Id.ToString();

        await _manager.OnOpen(_socketMock.Object, clientId);
        await _manager.OnClose(_socketMock.Object, clientId);

        Assert.Throws<InvalidOperationException>(() => _manager.GetSocketFromClientId(clientId));
    }

    [Test]
    public void GetClientIdFromSocket_ReturnsCorrectClientId()
    {
        string clientId = "knownClient";
        _manager.OnOpen(_socketMock.Object, clientId).Wait();

        var resolvedId = _manager.GetClientIdFromSocket(_socketMock.Object);
        Assert.That(resolvedId, Is.EqualTo(clientId));
    }

    [Test]
    public void GetClientIdFromSocket_Throws_WhenUnknownSocket()
    {
        var unknownSocket = new Mock<IWebSocketConnection>();
        unknownSocket.Setup(s => s.ConnectionInfo.Id).Returns(Guid.NewGuid());

        Assert.Throws<InvalidOperationException>(() => _manager.GetClientIdFromSocket(unknownSocket.Object));
    }
}