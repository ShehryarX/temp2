#include <Arduino.h>
#include "board.h"
#include <SoftwareSerial.h>
#include "pms5003.h"
#include "am2120.h"

#include <WiFiUdp.h>
#include <NTPClient.h>

#include <Firebase_ESP_Client.h>

#include <painlessMesh.h>

#include <string>

#if MESH_IS_ROOT
void received_cb(const uint32_t &from, const String &msg) {
  Serial.printf("[MESH] Recv from node %d:\n%s\n", from, msg.c_str());
}
#else
void received_cb(const uint32_t &from, const String &msg) {
  Serial.printf("[MESH] Recv from node %d:\n%s\n", from, msg.c_str());
}
#endif

PMS5003 pms;
AM2120 ams;

#if MESH_IS_ROOT
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
#endif

WiFiClient wifiClient;
painlessMesh mesh;
IPAddress myIp = IPAddress(0, 0, 0, 0);

IPAddress getLocalIp() {
  return IPAddress(mesh.getStationIP());
}

void setup() {
  Serial.begin(115200);
  Serial.printf("[GUARDIAN] Booting up board %s\n", BOARD_ID);

  Serial.print("[GUARDIAN] Connecting to wifi...");

  mesh.setDebugMsgTypes(ERROR | STARTUP | CONNECTION | COMMUNICATION | GENERAL);

  mesh.init(MESH_PREFIX, MESH_PSK, MESH_PORT, WIFI_AP_STA, 11);
  // mesh.onReceive(&received_cb);
#if MESH_IS_ROOT
  mesh.stationManual(WIFI_SSID, WIFI_PSK);
  mesh.setHostname(BOARD_ID);
  mesh.setRoot(true);
#endif
  mesh.setContainsRoot(true);

  pms.begin(PIN_PMS_TX);
  ams.begin(PIN_AM2120);
}

volatile bool hasSta = false;
volatile uint32_t root_node_id = 0;
volatile uint64_t last_update_time = 0;

uint32_t getRootNodeId(const painlessmesh::protocol::NodeTree &node) {
  if(node.root) return node.nodeId;
  // Search children
  for(const auto &sub : node.subs) {
    auto id = getRootNodeId(sub);
    if(id) return id;
  }
  return 0;
}

void loop() {
  mesh.update();
#if MESH_IS_ROOT
  if(hasSta) ntp_client.update();
#endif
  if(myIp != getLocalIp()) {
    myIp = getLocalIp();
    Serial.println();
    Serial.println("[GUARDIAN] Connected with IP: ");
    Serial.println(myIp);

#if MESH_IS_ROOT
    // One time setup on IP change
    ntp_client.begin();

    Serial.println("[GUARDIAN] Staring Firebase...");
    Firebase.begin(&fb_cfg, &fb_auth);
    Firebase.RTDB.setMaxRetry(&fbdo, 3);
    Firebase.RTDB.setMaxErrorQueue(&fbdo, 30);
    Serial.println("[GUARDIAN] Started Firebase!");
#else
    auto layout = mesh.asNodeTree();
    root_node_id = getRootNodeId(layout);

    Serial.printf("[MESH] Found root 0x%x\n", root_node_id);
#endif

    hasSta = true;
  }

#if MESH_IS_ROOT
  if(pms.loop() && ams.has_frame() && hasSta) {
    am2120_data amd;
    if(!ams.get_frame(amd)) return;
    pms5003data pmd = pms.get_frame();
#else
  if(hasSta && millis() - last_update_time >= 4000) {
    last_update_time = millis();

    am2120_data amd = {
      .humidity = 500,
      .temperature = 220,
      .checksum = 0
    };
    pms5003data pmd = {
      .framelen = 0,
      .pm10_standard = 1, .pm25_standard = 3, .pm100_standard = 2,
      .pm10_env = 1, .pm25_env = 3, .pm100_env = 2,
      .particles_03um = 10, .particles_05um = 15, .particles_10um = 30,
      .particles_25um = 22, .particles_50um = 2, .particles_100um = 0,
      .unused = 0, .checksum = 0
    };
#endif

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

#if MESH_IS_ROOT
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

    rtdbJson.set("epoch_time", ntp_client.getEpochTime());

    if(!Firebase.RTDB.setJSON(&fbdo, "/current/" BOARD_ID, &rtdbJson)) {
      Serial.println("Error:");
      Serial.println(fbdo.errorReason());
    }
#else
    // Send to root node
    rtdbJson.set("board_id", BOARD_ID);
    Serial.println("[GUARDIAN] Pushing msg...");
    mesh.sendSingle(root_node_id, String(rtdbJson.raw()));
#endif
  }
}