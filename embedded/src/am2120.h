#include <stdint.h>

#ifndef AM2120_H
#define AM2120_H

#define AM2120_NUM_BITS 40

enum am2120_state : uint8_t {
    IDLE = 0,
    MASTER_PULLDOWN,
    SLAVE_PULLDOWN,
    NTH_BIT,
    DONE,
};

enum am2120_buffer_state : uint8_t {
    NONE = 0,
    FRAME,
    OLD_FRAME,
    UPDATING,
};

struct am2120_data {
  uint16_t humidity;
  uint16_t temperature;
  uint8_t checksum;
};

class AM2120 {
public:
    void begin(int onewire_pin);
    void enable();
    void disable();
    bool has_frame();
    bool get_frame(am2120_data &out);
private:
    int _pin;
};

#endif