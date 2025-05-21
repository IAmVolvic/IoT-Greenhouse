#include "config.h"
#include "secrets.h"

const char* mqtt_topic_gas = "mq2/gas";
const char* mqtt_topic_temp = "sensor/temp";
const char* mqtt_topic_unassigned = "user/unassigned";

std::string getAssignTopic() {
    return std::string("user/assign/") + deviceId;
}