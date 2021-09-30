#include <Arduino.h>
#include "board.h"
#include <SoftwareSerial.h>
#include "pms5003.h"
#include "am2120.h"

#include <SPI.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

#include <Firebase_ESP_Client.h>

#include <string>

PMS5003 pms;
AM2120 ams;

void token_status_cb(TokenInfo token) {
  if(token.status == token_status_ready) {
    Serial.println("Token is ready!");
  } else if (token.error.code != 0) {
    Serial.printf("Token error %s\n", token.error.message.c_str());
  }
}

FirebaseAuth fb_auth = {
  .user = {
    .email = FB_EMAIL,
    .password = FB_PASSWORD
  }
};
FirebaseConfig fb_cfg = {
  .database_url = FB_DBURL,
  .api_key = FB_API_KEY,
  .token_status_callback = token_status_cb,
};
FirebaseData fbdo; // Reuse same data object
Firebase_ESP_Client fb;

WiFiUDP ntp_udp;
NTPClient ntp_client(ntp_udp, "pool.ntp.org", 0);

void setup() {
  Serial.begin(115200);
  Serial.printf("[GUARDIAN] Booting up board %s\n", BOARD_ID);

  Serial.print("[GUARDIAN] Connecting to wifi...");

  WiFi.begin(WIFI_SSID, WIFI_PSK);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }

  ntp_client.begin();
  while(!ntp_client.forceUpdate()) {
    delay(300);
  }

  Serial.println();
  Serial.println("[GUARDIAN] Connected with IP: ");
  Serial.println(WiFi.localIP());

  Serial.println("[GUARDIAN] Staring Firebase...");
  Firebase.begin(&fb_cfg, &fb_auth);
  Firebase.reconnectWiFi(true);
  Firebase.RTDB.setMaxRetry(&fbdo, 3);
  Firebase.RTDB.setMaxErrorQueue(&fbdo, 30);
  Serial.println("[GUARDIAN] Started Firebase!");

  pms.begin(PIN_PMS_TX);
  ams.begin(PIN_AM2120);
}

void loop() {
  ntp_client.update();

  if(pms.loop() && ams.has_frame()) {
    am2120_data amd;
    if(!ams.get_frame(amd)) return;
    pms5003data pmd = pms.get_frame();
    if(!Firebase.ready()) return;

    fb_esp_firestore_document_write_t update_write;
    update_write.type = fb_esp_firestore_document_write_type_update;
    std::string record_path = "records/" BOARD_ID "/logged/";
    // Append current time in epoch seconds
    record_path += std::to_string(ntp_client.getEpochTime());
    update_write.update_document_path = record_path.c_str();

    FirebaseJson json;
    json.set("fields/temp/integerValue", amd.temperature);
    json.set("fields/humidity/integerValue", amd.humidity);
    json.set("fields/pm10/integerValue", pmd.pm10_standard);
    json.set("fields/pm25/integerValue", pmd.pm25_standard);
    json.set("fields/pm100/integerValue", pmd.pm100_standard);
    json.set("fields/pt03/integerValue", pmd.particles_03um);
    json.set("fields/pt05/integerValue", pmd.particles_05um);
    json.set("fields/pt10/integerValue", pmd.particles_10um);
    json.set("fields/pt25/integerValue", pmd.particles_25um);
    json.set("fields/pt100/integerValue", pmd.particles_100um);
    json.set("fields/epoch_time/integerValue", ntp_client.getEpochTime());
    update_write.update_document_content = json.raw();

    std::vector<fb_esp_firestore_document_write_t> writes;
    writes.push_back(update_write);

    Serial.println("Commiting document...");
    if(!Firebase.Firestore.commitDocument(&fbdo, FB_PROJ_ID, "", writes, "")) {
      Serial.println("Error:");
      Serial.println(fbdo.errorReason());
    }

    FirebaseJson rtdbJson;
    rtdbJson.set("temp", amd.temperature);
    rtdbJson.set("humidity", amd.humidity);
    rtdbJson.set("pm10", pmd.pm10_standard);
    rtdbJson.set("pm25", pmd.pm25_standard);
    rtdbJson.set("pm100", pmd.pm100_standard);
    rtdbJson.set("pt03", pmd.particles_03um);
    rtdbJson.set("pt05", pmd.particles_05um);
    rtdbJson.set("pt10", pmd.particles_10um);
    rtdbJson.set("pt25", pmd.particles_25um);
    rtdbJson.set("pt100", pmd.particles_100um);
    rtdbJson.set("epoch_time", ntp_client.getEpochTime());

    if(!Firebase.RTDB.setJSON(&fbdo, "/current/" BOARD_ID, &rtdbJson)) {
      Serial.println("Error:");
      Serial.println(fbdo.errorReason());
    }
  }
}