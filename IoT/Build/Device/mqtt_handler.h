#pragma once
#include <PubSubClient.h>

extern PubSubClient client;
extern String user_assigned;

void mqtt_callback(char* topic, byte* message, unsigned int length);
void reconnect_mqtt();