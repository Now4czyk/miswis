
/**
 * Created by K. Suwatchai (Mobizt)
 *
 * Email: k_suwatchai@hotmail.com
 *
 * Github: https://github.com/mobizt/Firebase-ESP-Client
 *
 * Copyright (c) 2023 mobizt
 *
 */

/** Prerequisite
 * IAM owner permission required for service account,
 * https://github.com/mobizt/Firebase-ESP-Client#iam-permission-and-api-enable
 */

// This example shows how to list the CollectionIds from a document. This operation required OAUth2.0 authentication.

#include <Arduino.h>
#if defined(ESP32) || defined(ARDUINO_RASPBERRY_PI_PICO_W)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#elif __has_include(<WiFiNINA.h>)
#include <WiFiNINA.h>
#elif __has_include(<WiFi101.h>)
#include <WiFi101.h>
#elif __has_include(<WiFiS3.h>)
#include <WiFiS3.h>
#endif

#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "Smolna 13/20"
#define WIFI_PASSWORD "kaloryfer"

/** 2. Define the Service Account credentials (required for token generation)
 *
 * This information can be taken from the service account JSON file.
 *
 * To download service account file, from the Firebase console, goto project settings,
 * select "Service accounts" tab and click at "Generate new private key" button
 */
#define FIREBASE_PROJECT_ID "miswis-9cb98"
#define FIREBASE_CLIENT_EMAIL "firebase-adminsdk-n5qwo@miswis-9cb98.iam.gserviceaccount.com"
const char PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDQC6GVGZK/b5bS\n/gN3hpScwjP7Keu8Pty4m0PLDCtGZQbDP2sce1copAqeQk9F9u1RwXV1xHD1obcd\nQtZmtd5Sbm9H/xDH/uqQKoZmzTKS+Nk9Cn12McgUf3Aif6fmzaqmZ255xNR7DKGc\nOAthOyR1hQJvzp2IXhkWPkFxlz20W39YkTXqBnYFL7TWbb6cU8y1FJtlysXwz4pg\nWhd2dKf5fZcW/zfhWxmvi22eOPRPImq1HpaugvzOmrBQCztGeCG5s6ZABiNn82Yz\neeoE2RxvfbzBU6Xiq9/B52Dt1YBnnXV4XgeWq+nmtZsDModdkggexQp+tPx49qvd\nWIEshva5AgMBAAECggEAATCdLHlNzbrUKIHGavfB6tbw2CtoYJZqycLYPkA5ZnjW\nczsYyua+XApQJeaS2yoV4mVSXX7m9yivykLjGgmelhHGoNP0eHMHTBV02QAByDW/\nJv+5MaSy6cHEK5ZXqKodeJUtMb9una43+xOWURM3BVW3lVnKVzN+k5IolVSRnZye\nYkpaoSS7Apu7J36c1UBQsKwtT0UGdLaORbxqazeu/ReUfzFAjiXhDjy3DtwxlOQM\nG/lmHBGx3fbF9TOT0jKEY/0Pz6IB5cmbCZz30YmMj7b0w9CMc9datZJPt/MNcbPv\ntIYBfjSA3lAmhbDYWAdA/EiH48syxB4jUKZc+YSJeQKBgQDs9OTvkHzat4LWWQWx\n/4a6kFtcM6zKAhqmaqIJjIZ0dcB9Rr3cOS9ngRNYoVDseu7bwgp4Srea2WzKJ/pB\nLE2YKUDlHxNJxqIg21+FCZghbW2kwN9/9eNo1UqlPCIFLRHZEU2kma1GgZWnSVEK\nauTp4CTtLx5ZmaHScKH8o0LZLQKBgQDgw+xNET0CUHhUJer0sAz3+KYixm83pLXP\nnOsOu8KT93SICnqsFoPjRqS6joxwRAGzlmqvULDne9szAgYItlXYjqjYjuq/XK0/\n9Wj7kp9G3YMTCTtkmxKIRt0wiBUa3ooxqLZzdpDbhh9Eie+UQWD1IJBJtb8BIlP8\nD0CBqHJzPQKBgCqeBQrdNsdzl/GLQ033QjkNu5DCroIKjNZ/eTM0df4+K2ecsIsK\nMe9wtJUNNmvB1HHr3UwzTABquHlHZWgRWsdSLBzJUQPE2OYF7pET36urbbvjAI+Y\nHtV8/xbm0MuThpE+3nMLPLHgnpTex9eS0CcMLDgIcHH3ArbBkTDKADzlAoGAJ4hu\nXJPGnkyXDX3p2IXKkibq2bz7PNc8nzqjYWEG9U2V8oOdVf1TzzrSqHmAHBLqFbNE\nKnfP1bdEM7GMbCXd7YwSCJ0Cjwv28QPyJiWA3E8DyepaxvQ7izqjlvCofaRcvCVH\nigF1sxbhEwYL3JCvRA4pMr3DzahDC1eHaga9sqUCgYBpFHhQCSZvvalicftZuZoU\n3ypkbw6cml8PhvE/+738xrGoGPNy0NwIWg2cmN5ZuvWczR4OKURhsRZBqnI7RvDf\n0ew2IHwSONeyd8x+jLgb+G+f+7henlUU/qn5mOt1Pd/ED8mbLrp3UtezeJfKhxHW\nfRAXocDzE1hWDwetB29jsA==\n-----END PRIVATE KEY-----\n";

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

bool taskCompleted = false;
unsigned long dataMillis = 0;

#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
WiFiMulti multi;
#endif

void setup()
{

    Serial.begin(115200);

#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
    multi.addAP(WIFI_SSID, WIFI_PASSWORD);
    multi.run();
#else
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
#endif

    Serial.print("Connecting to Wi-Fi");
    unsigned long ms = millis();
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
        if (millis() - ms > 10000)
            break;
#endif
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

    /* Assign the user sign in credentials */
    config.service_account.data.client_email = FIREBASE_CLIENT_EMAIL;
    config.service_account.data.project_id = FIREBASE_PROJECT_ID;
    config.service_account.data.private_key = PRIVATE_KEY;

    // The WiFi credentials are required for Pico W
    // due to it does not have reconnect feature.
#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
    config.wifi.clearAP();
    config.wifi.addAP(WIFI_SSID, WIFI_PASSWORD);
#endif

    /* Assign the callback function for the long running token generation task */
    config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

    // Comment or pass false value when WiFi reconnection will control by your code or third party library e.g. WiFiManager
    Firebase.reconnectNetwork(true);

    // Since v4.4.x, BearSSL engine was used, the SSL buffer need to be set.
    // Large data transmission may require larger RX buffer, otherwise connection issue or data read time out can be occurred.
    fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);

    // Limit the size of response payload to be collected in FirebaseData
    fbdo.setResponseSize(2048);

    Firebase.begin(&config, &auth);

    // You can use TCP KeepAlive in FirebaseData object and tracking the server connection status, please read this for detail.
    // https://github.com/mobizt/Firebase-ESP-Client#about-firebasedata-object
    // fbdo.keepAlive(5, 5, 1);
}

void loop()
{

    // Firebase.ready() should be called repeatedly to handle authentication tasks.

    if (Firebase.ready() && (millis() - dataMillis > 60000 || dataMillis == 0))
    {
        dataMillis = millis();

        if (!taskCompleted)
        {
            taskCompleted = true;

            // For the usage of FirebaseJson, see examples/FirebaseJson/BasicUsage/Create_Edit_Parse/Create_Edit_Parse.ino
        }

        String documentPath = "target/6FgDIGvjkF9dUePasOEJ";
        String mask = "temperature";

        // If the document path contains space e.g. "a b c/d e f"
        // It should encode the space as %20 then the path will be "a%20b%20c/d%20e%20f"

        Serial.print("Get a document... ");

        if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), mask.c_str()))
            { 
              FirebaseJson payload;
              payload.setJsonData(fbdo.payload().c_str());
              FirebaseJsonData jsonData;
              payload.get(jsonData, "fields/temperature/integerValue", true);
              Serial.println(String(jsonData.intValue));
            }
        else
            Serial.println(fbdo.errorReason());
    }
}