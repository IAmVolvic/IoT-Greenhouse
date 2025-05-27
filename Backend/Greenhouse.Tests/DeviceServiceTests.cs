using System;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Mqtt.Interfaces;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Websocket.Interfaces;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure.Services;
using Moq;
using NUnit.Framework;

namespace Greenhouse.Tests
{
    [TestFixture]
    public class DeviceServiceTests
    {
        private Mock<IDeviceRepository> _deviceRepoMock;
        private Mock<IConnectionManager> _connMgrMock;
        private Mock<IMqttPublisher> _mqttPublisherMock;
        private DeviceService _deviceService;

        [SetUp]
        public void Setup()
        {
            _deviceRepoMock = new Mock<IDeviceRepository>();
            _connMgrMock = new Mock<IConnectionManager>();
            _mqttPublisherMock = new Mock<IMqttPublisher>();

            _deviceService = new DeviceService(_deviceRepoMock.Object, _connMgrMock.Object, _mqttPublisherMock.Object);
        }

        [Test]
        public void CheckAndAddUnassignedDevice_ShouldAddDevice_WhenNotExistsAnywhere()
        {
            // Arrange
            var deviceId = Guid.NewGuid();
            var dto = new UnassignedDeviceDto { DeviceId = deviceId };

            _deviceRepoMock.Setup(r => r.DeviceExists(deviceId)).Returns(false);
            _deviceRepoMock.Setup(r => r.DeviceExistsInUnassignedDevices(deviceId)).Returns(false);

            // Act
            _deviceService.CheckAndAddUnassignedDevice(dto);

            // Assert
            _deviceRepoMock.Verify(
                r => r.AddDeviceToUnassignedDevices(It.Is<UnassignedDevice>(d => d.Id == deviceId)),
                Times.Once);
        }

        [TestCase(true, false)]
        [TestCase(false, true)]
        [TestCase(true, true)]
        public void CheckAndAddUnassignedDevice_ShouldNotAddDevice_WhenAlreadyExists(bool exists, bool existsInUnassigned)
        {
            // Arrange
            var deviceId = Guid.NewGuid();
            var dto = new UnassignedDeviceDto { DeviceId = deviceId };

            _deviceRepoMock.Setup(r => r.DeviceExists(deviceId)).Returns(exists);
            _deviceRepoMock.Setup(r => r.DeviceExistsInUnassignedDevices(deviceId)).Returns(existsInUnassigned);

            // Act
            _deviceService.CheckAndAddUnassignedDevice(dto);

            // Assert
            _deviceRepoMock.Verify(
                r => r.AddDeviceToUnassignedDevices(It.IsAny<UnassignedDevice>()),
                Times.Never);
        }
    }
}
