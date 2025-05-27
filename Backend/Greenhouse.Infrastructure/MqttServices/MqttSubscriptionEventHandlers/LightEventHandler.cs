using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Greenhouse.Application.Mqtt.Dtos;
using Greenhouse.Application.Services.Logs;
using HiveMQtt.Client.Events;
using HiveMQtt.MQTT5.Types;

namespace Greenhouse.Infrastructure.MqttServices.MqttSubscriptionEventHandlers;

public class LightEventHandler(ILogService logService) : IMqttMessageHandler
{
    public string TopicFilter { get; } = "sensor/light";
    public QualityOfService QoS { get; } = QualityOfService.AtLeastOnceDelivery;

    public void Handle(object? sender, OnMessageReceivedEventArgs args)
    {
        var dto = JsonSerializer.Deserialize<DeviceLogDto>(args.PublishMessage.PayloadAsString,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? throw new Exception("Could not deserialize into DeviceLogDto from " +
                                      args.PublishMessage.PayloadAsString);
        
        var context = new ValidationContext(dto);
        Validator.ValidateObject(dto, context);

        logService.AddToDbAndBroadcast(dto);
    }
}