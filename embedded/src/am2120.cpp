#include <Arduino.h>
#include "am2120.h"

volatile am2120_state am2120_isr_state = IDLE;
volatile am2120_buffer_state am2120_buf_state = NONE;
volatile uint8_t am2120_bit = 0;
volatile uint64_t am2120_bit_time = 0;
volatile uint8_t am2120_bits[AM2120_NUM_BITS];
volatile uint8_t am2120_frame[AM2120_NUM_BITS / 8];

void am2120_copy_frame() {
    // Copy from bit to frame buffer
    am2120_buf_state = UPDATING;
    // Copy bits to the frame buffer
    memset((void *) am2120_frame, 0, AM2120_NUM_BITS / 8);
    // MSB first
    for(int bit = 0; bit < AM2120_NUM_BITS; bit ++) {
        am2120_frame[bit / 8] += am2120_bits[bit] << (7 - (bit % 8));
    }
    am2120_buf_state = FRAME; // Has fresh frame
}

void IRAM_ATTR am2120_isr_falling() {
  // Falling edge received; all we need
  switch(am2120_isr_state) {
    case DONE:
    case IDLE:
      am2120_bit_time = micros64();
      am2120_isr_state = MASTER_PULLDOWN;
      break;
    case MASTER_PULLDOWN: {
      uint64_t master_delay = micros64() - am2120_bit_time;
      // 0.5ms to 30ms
      if(master_delay >= 500 && master_delay <= 30 * 1000) {
          am2120_isr_state = SLAVE_PULLDOWN;
      } else {
          am2120_isr_state = IDLE; // error during pulldown reception
      }
      break;
    }
    case SLAVE_PULLDOWN:
      // First bit begin
      am2120_isr_state = NTH_BIT;
      am2120_bit = 0;
      am2120_bit_time = micros64();
      break;
    case NTH_BIT:
      // Inter bit, end of current bit, start of next
      // Delay from datasheet
      if(micros64() - am2120_bit_time >= 48 + 40) {
        am2120_bits[am2120_bit] = 1;
      } else {
        am2120_bits[am2120_bit] = 0;
      }
      am2120_bit ++;
      if(am2120_bit >= AM2120_NUM_BITS) {
        am2120_copy_frame();
        am2120_isr_state = DONE; // done receiving
      } else {
        // Mark start time for next bit
        am2120_bit_time = micros64();
        // keep at current state to read more bits
      }
  }

}

void AM2120::begin(int onewire_pin) {
    _pin = onewire_pin;
    pinMode(_pin, INPUT);
    enable();
}

void AM2120::enable() {
    attachInterrupt(digitalPinToInterrupt(_pin), am2120_isr_falling, FALLING);
}

void AM2120::disable() {
    detachInterrupt(digitalPinToInterrupt(_pin));
    am2120_isr_state = IDLE;
}

bool AM2120::has_frame() {
    return am2120_buf_state == FRAME;
}

bool AM2120::get_frame(am2120_data &out) {
    if(am2120_buf_state == NONE || am2120_buf_state == UPDATING) return false;

    // Aliases
    am2120_data &data = out;
    volatile uint8_t *frame = am2120_frame;

    data.humidity = (((uint16_t) frame[0] << 8) + (uint16_t) frame[1]);
    if(frame[2] & 0x8) {
        // Negative temperature
        frame[2] &= 0b01111111;
        data.temperature = (((uint16_t) frame[2] << 8) + (uint16_t) frame[3]);
        data.temperature = -data.temperature;
    } else {
        data.temperature = (((uint16_t) frame[2] << 8) + (uint16_t) frame[3]);
    }
    data.checksum = frame[4];

    uint8_t sum = frame[0] + frame[1] + frame[2] + frame[3];

    // Clear fresh buffer state
    am2120_buf_state = OLD_FRAME;
    return sum == data.checksum;
}

