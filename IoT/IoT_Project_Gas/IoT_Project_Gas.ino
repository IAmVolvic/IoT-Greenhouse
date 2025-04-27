#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#define AO_PIN 34  // MQ2 analog pin

const char* ssid = "Your wifi";
const char* password = "Wifi password";

const char* mqtt_server = "Mqqt server";
const int mqtt_port = 8883;
const char* mqtt_user = "Username";
const char* mqtt_pass = "Mqtt user password";
const char* mqtt_topic = "Mqtt/Topic";

// TLS/SSL
WiFiClientSecure wifiSecureClient;
PubSubClient client(wifiSecureClient);

void setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected. IP:");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to HiveMQ MQTT...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_pass)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  delay(100);

  analogSetAttenuation(ADC_11db);
  Serial.println("Warming up MQ2 sensor...");
  delay(90000);  // Let MQ2 stabilize

  setup_wifi();

  // Disable certificate validation (for testing only)
  wifiSecureClient.setInsecure(); // Don't use in production, use proper CA cert instead

  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int gasValue = analogRead(AO_PIN);
  Serial.print("MQ2 value: ");
  Serial.println(gasValue);

  String payload = String(gasValue);
  client.publish(mqtt_topic, payload.c_str());

  delay(1000);
}
