#include <pms5003.h>

void PMS5003::begin(int rx_pin) {
    _serial.begin(9600, SWSERIAL_8N1, rx_pin);
}

bool PMS5003::loop() {
    if(_serial.available() >= 32) {
        size_t cnt = _serial.readBytes(_rx_buffer, 32);
        if(cnt == 32) {
            return process_frame();
        } else {
            _serial.flush();
            return false;
        }
    } else {
        return false;
    }
}

bool PMS5003::process_frame() {
  // According to the datasheet, we have the values:
  // Header: 2 bytes, 0x42 0x4D
  if(_rx_buffer[0] != 0x42) return false;
  if(_rx_buffer[1] != 0x4D) return false;

  // Perform checksum calculation
  uint16_t sum = 0;
  for(int i = 0; i < 30; i ++) {
    sum += _rx_buffer[i];
  }

  // Convert endianess, skipping first 2 bytes
  uint16_t buf[15];
  for(int i = 0; i < 15; i ++) {
    buf[i] = _rx_buffer[2 + i * 2 + 1];
    buf[i] += _rx_buffer[2 + i * 2] << 8;
  }
  
  // Output to our frame
  memcpy(&_frame, buf, 30);
  return sum == _frame.checksum;
}

pms5003data PMS5003::get_frame() {
  return _frame;
}

void PMS5003::print_frame() {
  pms5003data data = _frame;
  Serial.println();
  Serial.println("---------------------------------------");
  Serial.println("Concentration Units (standard)");
  Serial.print("PM 1.0: "); Serial.print(data.pm10_standard);
  Serial.print("\t\tPM 2.5: "); Serial.print(data.pm25_standard);
  Serial.print("\t\tPM 10: "); Serial.println(data.pm100_standard);
  Serial.println("---------------------------------------");
  Serial.println("Concentration Units (environmental)");
  Serial.print("PM 1.0: "); Serial.print(data.pm10_env);
  Serial.print("\t\tPM 2.5: "); Serial.print(data.pm25_env);
  Serial.print("\t\tPM 10: "); Serial.println(data.pm100_env);
  Serial.println("---------------------------------------");
  Serial.print("Particles > 0.3um / 0.1L air:"); Serial.println(data.particles_03um);
  Serial.print("Particles > 0.5um / 0.1L air:"); Serial.println(data.particles_05um);
  Serial.print("Particles > 1.0um / 0.1L air:"); Serial.println(data.particles_10um);
  Serial.print("Particles > 2.5um / 0.1L air:"); Serial.println(data.particles_25um);
  Serial.print("Particles > 5.0um / 0.1L air:"); Serial.println(data.particles_50um);
  Serial.print("Particles > 10.0 um / 0.1L air:"); Serial.println(data.particles_100um);
  Serial.println("---------------------------------------");
}