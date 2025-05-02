namespace Greenhouse.Application.Mqtt.Interfaces;

public interface IMqttPublisher
{
    Task Publish(object dto, string topic);
}