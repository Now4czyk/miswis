#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
#define BMP280_ADDRES 0x76
Adafruit_BMP280 bmp; // I2C

int PWM_pin = 6;

float set_temp = 35.0;
float curr_temp = 0;

float Tp = 1.0;
float Kp = 80.28;
float Ki = 0.8692;
float Kd = 0.01957;

float prevError = 0;
float prevUi = 0;

int calculate_PID() {
  float error = set_temp - curr_temp;

  // Serial.println("Error: ");
  // Serial.println(error);

  float Up = Kp * error;

  float Ui = Ki * Tp / 2.0 * (error + prevError) + prevUi;

  prevUi = Ui;
  prevError = error;

  float u_sum = Up + Ui;
  // Serial.println("U_sum: ");
  // Serial.println(String(u_sum));
  return int(u_sum);
}

int saturation(int u) {
  if (u <= 0) {
    return 0;
  }
  else if (u >= 255) {
    return 255;
  }
  return u;
}

void setup() {
  pinMode(PWM_pin, OUTPUT);
  Serial.begin(115200);
  while ( !Serial ) delay(100);   // wait for native usb
  // Serial.println(F("BMP280 test"));
  unsigned status;
  status = bmp.begin(BMP280_ADDRES);
  if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                      "try a different address!"));
    Serial.print("SensorID was: 0x"); Serial.println(bmp.sensorID(),16);
    Serial.print("        ID of 0xFF probably means a bad address, a BMP 180 or BMP 085\n");
    Serial.print("   ID of 0x56-0x58 represents a BMP 280,\n");
    Serial.print("        ID of 0x60 represents a BME 280.\n");
    Serial.print("        ID of 0x61 represents a BME 680.\n");
    while (1) delay(10);

      /* Default settings from the datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
}
  }

  void loop() {
    curr_temp = bmp.readTemperature();
    // Serial.println("temperature: ");
    Serial.println(curr_temp);
    // Serial.println("U signal: ");
    int u = calculate_PID();
    int saturated_u = saturation(u);

    // Serial.println(String(u));

    analogWrite(PWM_pin, saturated_u);

    delay(1000);
}