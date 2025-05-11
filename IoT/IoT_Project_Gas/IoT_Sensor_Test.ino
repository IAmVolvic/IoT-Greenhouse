#define AO_PIN 34  // MQ2 analog pin

void setup() {
  Serial.begin(9600);
  delay(100);
  analogSetAttenuation(ADC_11db);  // Optional: improves ADC range on ESP32
}

void loop() {
  int gasValue = analogRead(AO_PIN);
  Serial.print("MQ2 value: ");
  Serial.println(gasValue);
  delay(1000);  // Wait 1 second between readings
}