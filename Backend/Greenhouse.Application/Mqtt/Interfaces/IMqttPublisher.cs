using HiveMQtt.MQTT5.Types;

namespace Greenhouse.Application.Mqtt.Interfaces;

public interface IMqttPublisher
{ Task Publish(object dto, string topic, QualityOfService qos);
}