#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "config.h"
#include "mqtt_handler.h"
#include "sensor_handler.h"
#include "state_manager.h"

WiFiClientSecure wifiSecureClient;
PubSubClient client(wifiSecureClient);

String user_assigned = "unassigned";
unsigned long user_defined_delay = 1000;
unsigned long lastUnassignedPublish = 0;

void setup_wifi() {
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected. IP:");
    Serial.println(WiFi.localIP());
}

void setup() {
    Serial.begin(9600);
    delay(100);

    setup_wifi();
    wifiSecureClient.setInsecure();

    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(mqtt_callback);

    setup_sensors();
    user_assigned = load_user();
}

void loop() {
    if (!client.connected()) reconnect_mqtt();
    client.loop();

    if (user_assigned == "unassigned") {
        if (millis() - lastUnassignedPublish > 10000) {
            StaticJsonDocument<200> doc;
            doc["DeviceId"] = deviceId;
            String payload;
            serializeJson(doc, payload);
            client.publish(mqtt_topic_unassigned, payload.c_str());
            lastUnassignedPublish = millis();
        }
    } else {
        int gas = read_gas_value();
        float temp = read_temperature();

        StaticJsonDocument<200> doc1, doc2;

        doc1["Unit"] = "gas";
        doc1["Value"] = gas;
        doc1["DeviceId"] = deviceId;
        doc1["Type"] = "gas";

        String gasPayload;
        serializeJson(doc1, gasPayload);
        client.publish(mqtt_topic_gas, gasPayload.c_str());

        doc2["Unit"] = "Celcius";
        doc2["Value"] = temp;
        doc2["DeviceId"] = deviceId;
        doc2["Type"] = "temperature";

        String tempPayload;
        serializeJson(doc2, tempPayload);
        client.publish(mqtt_topic_temp, tempPayload.c_str());
    }

    delay(10);
}