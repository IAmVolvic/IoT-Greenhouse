#include "sensor_handler.h"
#include <DallasTemperature.h>
#include <OneWire.h>

#define AO_PIN 34
#define ONE_WIRE_BUS 25

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup_sensors() {
    pinMode(ONE_WIRE_BUS, INPUT_PULLUP);
    analogSetAttenuation(ADC_11db);
    sensors.begin();
}

int read_gas_value() {
    return analogRead(AO_PIN);
}

float read_temperature() {
    sensors.requestTemperatures();
    float temperatureC = sensors.getTempCByIndex(0);
    return temperatureC;
}