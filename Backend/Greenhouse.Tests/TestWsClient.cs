using System.Collections.Concurrent;
using Websocket.Client;

namespace Greenhouse.Tests;

public class TestWsClient
{
    public TestWsClient()
    {
        WsClientId = Guid.NewGuid().ToString();
        var url = "ws://localhost:" + "4001" + "?id=" + WsClientId;
        var websocketUrl = new Uri(url);
        Console.WriteLine("Connecting to websocket at: " + websocketUrl);
        WsClient = new WebsocketClient(websocketUrl);

        WsClient.MessageReceived.Subscribe(msg => { ReceivedMessages.Enqueue(msg.Text); });
        WsClient.StartOrFail();
        Task.Delay(1000).GetAwaiter().GetResult();
    }

    public WebsocketClient WsClient { get; set; }
    public string WsClientId { get; set; }
    public ConcurrentQueue<string> ReceivedMessages { get; } = new();
}