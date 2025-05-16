#pragma once
#include <string>

extern const char* ssid;
extern const char* password;
extern const char* deviceId;

extern const char* mqtt_server;
extern const int mqtt_port;
extern const char* mqtt_user;
extern const char* mqtt_pass;

extern const char* mqtt_topic_gas;
extern const char* mqtt_topic_temp;
extern const char* mqtt_topic_unassigned;

std::string getAssignTopic();