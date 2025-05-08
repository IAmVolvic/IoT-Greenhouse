#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>

#define AO_PIN 34  // MQ2 analog pin

const char* ssid = "Wifi name";
const char* password = "Wifi password";

const char* mqtt_server = "Mqtt server";
const int mqtt_port = 8883;
const char* mqtt_user = "login for mqtt broker";
const char* mqtt_pass = "password for mqtt broker";
const char* mqtt_topic_gas = "mq2/gas";
const char* mqtt_topic_unassigned = "user/unassigned";
const char* mqtt_topic_assign = "user/assign/*id of the device*";

WiFiClientSecure wifiSecureClient;
PubSubClient client(wifiSecureClient);
Preferences preferences;

String user_assigned = "";  
unsigned long lastUnassignedPublish = 0;

void callback(char* topic, byte* message, unsigned int length);

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
      client.subscribe(mqtt_topic_assign);
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

  setup_wifi();

  wifiSecureClient.setInsecure(); // Do testów, nie w produkcji

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  preferences.begin("my-device", false);
  if (preferences.isKey("user")) {
    user_assigned = preferences.getString("user");
    Serial.print("Loaded assigned user: ");
    Serial.println(user_assigned);
  } else {
    Serial.println("No assigned user yet.");
  }
  preferences.end();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  if (user_assigned == "") {
    unsigned long now = millis();
    if (now - lastUnassignedPublish > 10000) {
      StaticJsonDocument<200> deviceInfo;  
      deviceInfo["DeviceId"] = "device id";  
      String info;
      serializeJson(deviceInfo, info);
      client.publish(mqtt_topic_unassigned, info.c_str());
      Serial.println("Published unassigned DeviceId.");
      lastUnassignedPublish = now;
    }
  } else {
    int gasValue = analogRead(AO_PIN);
    Serial.print("MQ2 value: ");
    Serial.println(gasValue);

    StaticJsonDocument<200> doc;  
    doc["Unit"] = "gas";         
    doc["Value"] = gasValue;     
    doc["DeviceId"] = "device id";  
    doc["Type"] = "gas";

    String payload;
    serializeJson(doc, payload);
    client.publish(mqtt_topic_gas, payload.c_str());

    delay(1000);
  }
}

void callback(char* topic, byte* message, unsigned int length) {
  String incoming = "";
  for (int i = 0; i < length; i++) {
    incoming += (char)message[i];
  }
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  Serial.println(incoming);

  if (String(topic) == mqtt_topic_assign) {
    preferences.begin("my-device", false);
    preferences.putString("user", incoming);
    preferences.end();
    user_assigned = incoming;
    Serial.print("Updated user_assigned to: ");
    Serial.println(user_assigned);
  }
}
