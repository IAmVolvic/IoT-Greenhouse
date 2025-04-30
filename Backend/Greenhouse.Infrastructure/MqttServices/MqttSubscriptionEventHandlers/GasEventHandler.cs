using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Greenhouse.Application.Mqtt.Dtos;
using HiveMQtt.Client.Events;
using HiveMQtt.MQTT5.Types;
using Microsoft.Extensions.Logging;

namespace Greenhouse.Infrastructure.MqttServices.MqttSubscriptionEventHandlers;

public class GasEventHandler : IMqttMessageHandler
{
    private readonly ILogger<GasEventHandler> _logger;

    public GasEventHandler(ILogger<GasEventHandler> logger)
    {
        _logger = logger;
    }

    public string TopicFilter { get; } = "mq2/gas";
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

        _logger.LogInformation("Received gas data: {@Dto}", dto); // ← Logging here
        Console.WriteLine($"[GasEventHandler] Received gas data: {JsonSerializer.Serialize(dto)}");
    }
}