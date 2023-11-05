import serial
import matplotlib.pyplot as plt
from collections import deque
import numpy as np
import csv

# Konfiguracja portu szeregowego
serial_port = 'COM6'  # Zmień na odpowiedni port COM dla Twojego Arduino
baud_rate = 115200

# Inicjalizacja kolejki na dane
max_data_points = 10000  # Maksymalna liczba punktów na wykresie
data = deque(maxlen=max_data_points)
time = deque(maxlen=max_data_points)

# Inicjalizacja wykresu
plt.ion()  # Tryb interaktywny
fig, ax = plt.subplots()
line, = ax.plot(time, data)
ax.set_xlabel('Czas (s)')
ax.set_ylabel('Temperatura (°C)')
ax.set_title('Pomiary Temperatury w Czasie Rzeczywistym')

# Inicjalizacja połączenia z portem szeregowym
ser = serial.Serial(serial_port, baud_rate)

csv_file = 'pomiary_temperatury.csv'
with open(csv_file, 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(['Nr próbki', 'Temperatura (°C)'])

try:
    while True:
        line_data = ser.readline().decode().strip()
        try:
            temperature = float(line_data)
            print(temperature)
            data.append(temperature)
            time.append(len(data))
            line.set_data(time, data)
            with open(csv_file, 'a', newline='') as csvfile:
                csv_writer = csv.writer(csvfile)
                csv_writer.writerow([len(time), temperature])

            ax.relim()
            ax.autoscale_view()
            plt.pause(1)  # Odśwież wykres co 100 ms
        except ValueError:
            pass
except KeyboardInterrupt:
    ser.close()
    print("Zamknięto połączenie szeregowe.")
