#include "state_manager.h"
#include <Preferences.h>

Preferences preferences;

String load_user() {
    preferences.begin("my-device", false);
    String user = preferences.isKey("user") ? preferences.getString("user") : "unassigned";
    preferences.end();
    return user;
}