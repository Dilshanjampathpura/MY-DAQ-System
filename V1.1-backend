require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');  // Corrected import for serialport v10+
const { ReadlineParser } = require('@serialport/parser-readline');  // Correct import for the Readline parser
const app = express();

app.use(cors());

// Set up the serial port (adjust to your COM port)
const port = new SerialPort({ path: 'COM8', baudRate: 9600 }); // Adjust COM port and baud rate if needed
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));  // Corrected usage of ReadlineParser

// This will hold the latest sensor data
let sensorData = {
    humidity: null,
    temperature: null,
    rainflow: null,
    lightIntensity: null
};

// Read data from the serial port
parser.on('data', (line) => {
    console.log(`Received data: ${line}`);
    
    // Assuming the serial data is formatted as: humidity,temperature,rainflow,lightIntensity
    // For example: "50,22,30,1"
    const data = line.split(',');
    
    if (data.length === 4) {
        sensorData = {
            humidity: parseInt(data[0]),       // First value is humidity
            temperature: parseInt(data[1]),   // Second value is temperature
            rainflow: parseInt(100 - data[2]),      // Third value is rainflow
            lightIntensity: parseInt(data[3]) // Fourth value is light intensity
        };
    }
});

// Route to get the sensor data
app.get('/api/sensor-data', (req, res) => {
    if (
        sensorData.humidity !== null &&
        sensorData.temperature !== null &&
        sensorData.rainflow !== null &&
        sensorData.lightIntensity !== null
    ) {
        // Send the latest sensor data to the frontend
        res.json(sensorData);
    } else {
        res.status(500).json({ message: 'Sensor data is not available' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

