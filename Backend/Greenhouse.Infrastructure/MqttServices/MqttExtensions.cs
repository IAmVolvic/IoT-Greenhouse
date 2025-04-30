using System.Text.Json;
using Greenhouse.Application.Mqtt.Interfaces;
using Greenhouse.Infrastructure.Environment;
using Greenhouse.Infrastructure.MqttServices;
using Greenhouse.Infrastructure.MqttServices.MqttSubscriptionEventHandlers;
using HiveMQtt.Client;
using HiveMQtt.Client.Exceptions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

public static class MqttExtensions
{
    public static IServiceCollection RegisterMqttInfrastructure(this IServiceCollection services)
    {
        // Register all handlers implementing IMqttMessageHandler as the interface
        var subscribeHandlers = typeof(IMqttMessageHandler).Assembly
            .GetTypes()
            .Where(t => !t.IsAbstract && typeof(IMqttMessageHandler).IsAssignableFrom(t));

        foreach (var handlerType in subscribeHandlers)
        {
            services.AddScoped(typeof(IMqttMessageHandler), handlerType);
        }

        services.AddSingleton<HiveMQClient>(sp =>
        {
            var mqttSettings = sp.GetRequiredService<IOptions<MqttSettings>>().Value;
            var logger = sp.GetRequiredService<ILogger<HiveMQClient>>();

            var options = new HiveMQClientOptionsBuilder()
                .WithWebSocketServer($"wss://{mqttSettings.MQTT_BROKER_HOST}:8884/mqtt")
                .WithClientId($"myClientId_{Guid.NewGuid()}")
                .WithCleanStart(true)
                .WithKeepAlive(30)
                .WithAutomaticReconnect(true)
                .WithMaximumPacketSize(1024)
                .WithReceiveMaximum(100)
                .WithSessionExpiryInterval(3600)
                .WithUserName(mqttSettings.MQTT_USERNAME)
                .WithPassword(mqttSettings.MQTT_PASSWORD)
                .WithRequestProblemInformation(true)
                .WithRequestResponseInformation(true)
                .WithAllowInvalidBrokerCertificates(true) // for dev only
                .Build();
            logger.LogInformation("Attempting to connect to MQTT broker at {Broker}", mqttSettings.MQTT_BROKER_HOST);

            var client = new HiveMQClient(options);

            client.OnDisconnectReceived += (sender, args) =>
            {
                logger.LogWarning("MQTT client disconnected");
            };

            const int maxRetries = 5;
            for (var attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    logger.LogInformation("Attempting to connect to MQTT broker (attempt {attempt}/{maxRetries})",
                        attempt, maxRetries);

                    var connectResult = client.ConnectAsync().GetAwaiter().GetResult();

                    logger.LogInformation("Connection successful on attempt {attempt}. Result: {result}",
                        attempt,
                        JsonSerializer.Serialize(new
                        {
                            connectResult.ResponseInformation,
                            connectResult.ReasonString
                        }));

                    break;
                }
                catch (HiveMQttClientException ex)
                {
                    logger.LogError(ex, "Error connecting to MQTT broker on attempt {attempt}", attempt);

                    if (attempt == maxRetries)
                        logger.LogError("Max retries reached");

                    Thread.Sleep(TimeSpan.FromSeconds(Math.Pow(2, attempt)));
                }
            }

            // Subscribe to handlers' topics and attach message routing
            using (var scope = sp.CreateScope())
            {
                var handlers = scope.ServiceProvider.GetServices<IMqttMessageHandler>();

                foreach (var handler in handlers)
                {
                    logger.LogInformation("Subscribing to topic {Topic}", handler.TopicFilter);

                    client.SubscribeAsync(handler.TopicFilter, handler.QoS).GetAwaiter().GetResult();

                    client.OnMessageReceived += (sender, args) =>
                    {
                        foreach (var handler in handlers)
                        {
                            if (args.PublishMessage.Topic == handler.TopicFilter)
                            {
                                handler.Handle(sender, args);
                            }
                        }
                    };
                }
            }

            return client;
        });

        services.AddSingleton<IMqttPublisher, MqttPublisher>();
        return services;
    }
}
