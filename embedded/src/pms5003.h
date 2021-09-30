#include <stdint.h>
#include <SoftwareSerial.h>

#ifndef PMS5003_H
#define PMS5003_H

struct pms5003data {
  uint16_t framelen;
  uint16_t pm10_standard, pm25_standard, pm100_standard;
  uint16_t pm10_env, pm25_env, pm100_env;
  uint16_t particles_03um, particles_05um, particles_10um, particles_25um, particles_50um, particles_100um;
  uint16_t unused;
  uint16_t checksum;
};

class PMS5003 {
public:
    void begin(int rx_pin);
    bool loop();
    pms5003data get_frame();
    void print_frame();
private:
    SoftwareSerial _serial;
    uint8_t _rx_buffer[32];
    pms5003data _frame;
    bool process_frame();
};

#endif