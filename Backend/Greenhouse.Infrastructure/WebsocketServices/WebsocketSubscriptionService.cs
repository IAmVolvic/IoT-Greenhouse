﻿using Greenhouse.Application.Websocket.Interfaces;

namespace Greenhouse.Infrastructure.WebsocketServices;

public class WebsocketSubscriptionService(IConnectionManager connectionManager) : IWebsocketSubscriptionService
{
    public async Task SubscribeToTopic(string clientId, List<string> topicIds)
    {
        foreach (var topicId in topicIds) await connectionManager.AddToTopic(topicId, clientId);
    }

    public async Task UnsubscribeFromTopic(string clientId, List<string> topicIds)
    {
        foreach (var topicId in topicIds) await connectionManager.RemoveFromTopic(topicId, clientId);
    }
}