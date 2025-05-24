using System.Collections.Concurrent;
using System.Text.Encodings.Web;
using System.Text.Json;
using HiveMQtt.Client;

namespace Greenhouse.Tests;

public class TestMqttClient
{
    public TestMqttClient(string host, string username, string password)
    {
        var options = new HiveMQClientOptionsBuilder()
            .WithWebSocketServer(
                $"wss://{host}:8884/mqtt") // Using WSS (secure WebSocket)
            .WithClientId($"myClientId_{Guid.NewGuid()}")
            .WithCleanStart(true)
            .WithKeepAlive(30)
            .WithAutomaticReconnect(true)
            .WithMaximumPacketSize(1024)
            .WithReceiveMaximum(100)
            .WithSessionExpiryInterval(3600)
            .WithUserName(username)
            .WithPassword(password)
            .WithRequestProblemInformation(true)
            .WithRequestResponseInformation(true)
            .WithAllowInvalidBrokerCertificates(true)
            .Build();
        MqttClient = new HiveMQClient(options);
        MqttClient.OnMessageReceived += (_, args) =>
        {
            var jsonSerializerOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            var jsonElement = JsonSerializer.Deserialize<JsonElement>(args.PublishMessage.PayloadAsString);
            var stringRepresentation = JsonSerializer.Serialize(jsonElement, jsonSerializerOptions);
            ReceivedMessages.Enqueue(stringRepresentation);
            Console.WriteLine($"Received message: {stringRepresentation}");
        };
        MqttClient.ConnectAsync().GetAwaiter().GetResult();
    }

    public string DeviceId { get; } = Guid.NewGuid().ToString();
    public HiveMQClient MqttClient { get; }
    public ConcurrentQueue<string> ReceivedMessages { get; } = new();
}