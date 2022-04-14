#Import library
# Write your code here :-)
import sys
import time
import board
import json
import adafruit_ahtx0

# Create sensor object, communicating over the board's default I2C bus
i2c = board.I2C()  # uses board.SCL and board.SDA
sensor = adafruit_ahtx0.AHTx0(i2c)

def main(argv):
    argument = ''
    usage = 'usage: AHT10GetTempAndHumidity.py'

    data = {
        "temperature": sensor.temperature,
        "humidity": sensor.relative_humidity,
        "location": "Raspberry Pi 3B+"
    }

    data = json.dumps(data);

    print(data);

    #print("\nTemperature: %0.1f C" % sensor.temperature)
    #print("Humidity: %0.1f %%" % sensor.relative_humidity)

if __name__ == "__main__":
    main(sys.argv[1:])
