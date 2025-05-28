using System;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Services.Logs;
using Greenhouse.Application.Websocket.DTOs;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure.Services;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;

namespace Greenhouse.Tests;

[TestFixture]
public class LogServiceTests
{
    private Mock<ILogRepository> _logRepositoryMock;
    private Mock<IConnectionManager> _connectionManagerMock;
    private LogService _logService;

    [SetUp]
    public void Setup()
    {
        _logRepositoryMock = new Mock<ILogRepository>();
        _connectionManagerMock = new Mock<IConnectionManager>();

        _logService = new LogService(_logRepositoryMock.Object, _connectionManagerMock.Object);
    }

    [Test]
    public void AddToDbAndBroadcast_ShouldAddLogToRepository()
    {
        // Arrange
        var logDto = new DeviceLogDto
        {
            DeviceId = Guid.NewGuid(),
            Unit = "°C",
            Value = 25,
            Type = "Temperature"
        };

        var capturedLog = new Log();
        _logRepositoryMock
            .Setup(repo => repo.AddDeviceLog(It.IsAny<Log>()))
            .Callback<Log>(log => capturedLog = log);

        // Act
        _logService.AddToDbAndBroadcast(logDto);

        // Assert
        _logRepositoryMock.Verify(r => r.AddDeviceLog(It.IsAny<Log>()), Times.Once);
        Assert.That(capturedLog, Is.Not.Null, "Log was not captured");
        Assert.Multiple(() =>
        {
            Assert.That(capturedLog.DeviceId, Is.EqualTo(logDto.DeviceId));
            Assert.That(capturedLog.Unit, Is.EqualTo(logDto.Unit));
            Assert.That(capturedLog.Value, Is.EqualTo(logDto.Value));
            Assert.That(capturedLog.Type, Is.EqualTo(logDto.Type));
            Assert.That(capturedLog.Date, Is.Not.EqualTo(default(DateTime)), "Date was not set");
        });
    }

    [Test]
    public void AddToDbAndBroadcast_ShouldBroadcastLogToCorrectTopic()
    {
        // Arrange
        var deviceId = Guid.NewGuid(); // Use a known GUID for reference
        var logDto = new DeviceLogDto
        {
            DeviceId = deviceId,
            Unit = "°C",
            Value = 25,
            Type = "Temperature"
        };

        var capturedBroadcast = new ServerBroadcastsLogToDashboard();
        var capturedTopic = "";

        _connectionManagerMock
            .Setup(cm => cm.BroadcastToTopic(It.IsAny<string>(), It.IsAny<ServerBroadcastsLogToDashboard>()))
            .Callback<string, object>((topic, msg) =>
            {
                capturedTopic = topic;
                capturedBroadcast = msg as ServerBroadcastsLogToDashboard;
            })
            .Returns(Task.CompletedTask);

        // Act
        _logService.AddToDbAndBroadcast(logDto);

        // Assert
        _connectionManagerMock.Verify(cm => cm.BroadcastToTopic(It.IsAny<string>(), It.IsAny<object>()), Times.Once);
        Assert.Multiple(() =>
        {
            Assert.That(capturedTopic, Is.EqualTo(deviceId.ToString()), "Broadcast topic mismatch");
            Assert.That(capturedBroadcast, Is.Not.Null, "Broadcast message was null");
        });
        Assert.Multiple(() =>
        {
            Assert.That(capturedBroadcast.Log.DeviceId, Is.EqualTo(logDto.DeviceId));
            Assert.That(capturedBroadcast.Log.Unit, Is.EqualTo(logDto.Unit));
        });
    }

}
