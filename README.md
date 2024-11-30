# MY-DAQ-System
This project implements a data acquisition (DAQ) system that reads sensor data from multiple environmental sensors and stores the readings for further analysis. It uses an ATmega328P microcontroller, interfaced with a USB-to-TTL converter (CH340), to gather data from three key sensors
  YL-83 Rain Sensor: Detects rain levels.
  LDR (Light Dependent Resistor) Sensor: Measures light intensity.
  DHT22: Collects temperature and humidity readings.
The system displays the sensor data on an LCD screen and stores the values in a MongoDB database for easy retrieval and analysis. The project is designed to be low-power and modular, allowing easy integration with various sensors for broader applications in environmental monitoring.

Key Features:

Real-time data display on an LCD.
Data logging to a MongoDB database for future analysis.
Integration of multiple environmental sensors.
Low-cost, efficient, and scalable design.
Version 1.0 This version includes the initial setup for sensor data collection, LCD functionality, and the first version of the database integration.
