using System.Text.Json;
using Greenhouse.Application.Mqtt.Interfaces;
using HiveMQtt.Client;
using HiveMQtt.MQTT5.Types;

namespace Greenhouse.Infrastructure.MqttServices;

public class MqttPublisher(HiveMQClient client) : IMqttPublisher
{
    public async Task Publish(object dto, string topic)
    {
        await client.PublishAsync(topic, JsonSerializer.Serialize(dto, new JsonSerializerOptions
            { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }), QualityOfService.AtLeastOnceDelivery);
    }
}