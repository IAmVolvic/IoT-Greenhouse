namespace Greenhouse.Application.Websocket.Interfaces;

public interface IWebsocketSubscriptionService
{
    public Task SubscribeToTopic(string clientId, List<string> topicIds);
    public Task UnsubscribeFromTopic(string clientId, List<string> topicIds);
}