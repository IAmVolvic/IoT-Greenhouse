#include "mqtt_handler.h"
#include "config.h"
#include "state_manager.h"

void mqtt_callback(char* topic, byte* message, unsigned int length) {
    String incoming;
    for (unsigned int i = 0; i < length; i++) {
        incoming += (char)message[i];
    }

    if (incoming.startsWith("\"") && incoming.endsWith("\"")) {
        incoming = incoming.substring(1, incoming.length() - 1);
    }

    Serial.printf("Message on [%s]: %s\n", topic, incoming.c_str());

    if (String(topic) == getAssignTopic().c_str()) {
        preferences.begin("my-device", false);
        preferences.putString("user", incoming);
        preferences.end();
        user_assigned = incoming;
        Serial.println("User assigned: " + user_assigned);
    }
}

void reconnect_mqtt() {
    while (!client.connected()) {
        Serial.print("Connecting to MQTT...");
        if (client.connect("ESP32Client", mqtt_user, mqtt_pass)) {
            Serial.println("connected");
            client.subscribe(getAssignTopic().c_str());
        } else {
            Serial.printf("failed, rc=%d. Retrying...\n", client.state());
            delay(5000);
        }
    }
}
