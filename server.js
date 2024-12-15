require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
app.use(cors());
app.use(express.json());

let currentPort = null;
let sensorData = {
    humidity: null,
    temperature: null,
    rainflow: null,
    lightIntensity: null,
    isManualMode: false
};

// Function to list available COM ports
async function listPorts() {
    try {
        const ports = await SerialPort.list();
        return ports.map(port => port.path);
    } catch (error) {
        console.error('Error listing ports:', error);
        return [];
    }
}

// Function to connect to a specific port
function connectToPort(portPath) {
    if (currentPort) {
        currentPort.close();
    }

    const port = new SerialPort({ path: portPath, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser.on('data', (line) => {
        console.log(`Received data: ${line}`);
        
        const data = line.split(',');
        
        if (data.length === 5) {
            sensorData = {
                humidity: parseInt(data[0]),
                temperature: parseInt(data[1]),
                rainflow: parseInt(100 - data[2]),
                lightIntensity: parseInt(data[3]),
                isManualMode: parseInt(data[4]) === 1
            };
        }
    });

    currentPort = port;
    return port;
}

// Route to get available COM ports
app.get('/api/ports', async (req, res) => {
    const ports = await listPorts();
    res.json(ports);
});

// Route to connect to a specific port
app.post('/api/connect-port', (req, res) => {
    const { port } = req.body;
    try {
        const serialPort = connectToPort(port);
        res.json({ message: `Connected to port ${port}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to port' });
    }
});

// Route to get sensor data
app.get('/api/sensor-data', (req, res) => {
    if (
        sensorData.humidity !== null &&
        sensorData.temperature !== null &&
        sensorData.rainflow !== null &&
        sensorData.lightIntensity !== null
    ) {
        res.json(sensorData);
    } else {
        res.status(500).json({ message: 'Sensor data is not available' });
    }
});

// Route to send commands to Arduino
app.post('/api/control', (req, res) => {
    const { command } = req.body;
    
    if (!currentPort) {
        return res.status(500).json({ error: 'No port connected' });
    }

    // Send command to Arduino via serial port
    currentPort.write(`${command}\n`, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send command' });
        }
        res.json({ message: 'Command sent successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});