using System.Text.Json;
using Greenhouse.Application.Mqtt.Interfaces;
using HiveMQtt.Client;
using HiveMQtt.MQTT5.Types;

namespace Greenhouse.Infrastructure.MqttServices;

public class MqttPublisher(HiveMQClient client) : IMqttPublisher
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task Publish(object dto, string topic, QualityOfService qos)
    {
        var json = JsonSerializer.Serialize(dto, JsonOptions);
        await client.PublishAsync(topic, json, qos);
    }
}