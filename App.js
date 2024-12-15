import React, { useState, useEffect } from "react";
import './App.css';  // or wherever you want to place the CSS
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Background image import (you'll need to add this image to your project)
import backgroundImage from './background.jpg';

// SensorCard Component
const SensorCard = ({ title, color, currentValue, graphData, unit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const safeCurrentValue = currentValue ?? 0;
  const safeGraphData = graphData.length > 0 ? graphData : [{ time: "", value: 0 }];

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
  };

  return (
    <>
      <div 
        className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center space-y-4 transform transition-all duration-300 hover:scale-105 cursor-pointer`}
        onClick={handleCardClick}
      >
        <h3 className="text-2xl font-bold text-gray-800 bg-white/50 px-4 py-1 rounded-full">{title}</h3>
        <div className="w-full flex justify-center">
          <ResponsiveContainer width={150} height={150}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={15}
              data={[
                { value: safeCurrentValue, fill: color },
                { value: Math.max(0, 100 - safeCurrentValue), fill: "#E0E0E0" },
              ]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar minAngle={15} clockWise dataKey="value" />
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold"
              >
                {safeCurrentValue.toFixed(1)} {unit}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={safeGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-8"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{title} Detailed Graph</h2>
              <button 
                onClick={handleCloseModal} 
                className="text-red-500 hover:text-red-700 text-3xl"
              >
                &times;
              </button>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={safeGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={3}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold">
                Current {title}: {safeCurrentValue.toFixed(1)} {unit}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// LightIntensityCard Component
const LightIntensityCard = ({ title, ldrValue }) => {
  const [skyColor, setSkyColor] = useState('bg-gradient-to-b from-indigo-900 to-black');
  const [sunStyle, setSunStyle] = useState({
    top: '100%',
    transition: 'top 1s ease-in-out'
  });
  const [moonPosition, setMoonPosition] = useState('top-1/4');

  useEffect(() => {
    // Simulate day-night cycle
    const isDay = ldrValue === 0;
    
    if (isDay) {
      // Sun rising from bottom to top, centered
      setSkyColor('bg-gradient-to-b from-blue-200 to-blue-400');
      setSunStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'top 1s ease-in-out'
      });
      setMoonPosition('-top-full');
    } else {
      // Moon rising animation
      setSkyColor('bg-gradient-to-b from-indigo-900 to-black');
      setSunStyle({
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'top 1s ease-in-out'
      });
      setMoonPosition('top-1/4');
    }
  }, [ldrValue]);

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center space-y-4 transform transition-all duration-300 hover:scale-105`}>
      <h3 className="text-2xl font-bold text-gray-800 bg-white/50 px-4 py-1 rounded-full">{title}</h3>
      <div className={`relative w-full h-48 overflow-hidden ${skyColor} transition-all duration-1000 ease-in-out rounded-xl`}>
        {/* Sun */}
        <div 
          className={`absolute
          w-20 h-20 bg-yellow-400 rounded-full 
          transition-all duration-1000 ease-in-out
          animate-pulse shadow-2xl`}
          style={{
            ...sunStyle,
            boxShadow: '0 0 100px 40px rgba(255, 255, 0, 0.3)'
          }}
        />

        {/* Moon */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 ${moonPosition} 
          w-16 h-16 bg-gray-100 rounded-full 
          transition-all duration-1000 ease-in-out
          shadow-2xl`}
          style={{
            boxShadow: '0 0 80px 30px rgba(255, 255, 255, 0.2)',
            transition: 'top 1s ease-in-out'
          }}
        />

        {/* Stars (only visible at night) */}
        {ldrValue !== 0 && (
          <>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                  width: `${Math.random() * 3}px`,
                  height: `${Math.random() * 3}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 2 + 1}s`
                }}
              />
            ))}
          </>
        )}
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-700">
          Light Intensity: {ldrValue === 0 ? "Light" : "Dark"}
        </p>
        <p className="text-sm text-gray-500">Raw LDR Value: {ldrValue}</p>
      </div>
    </div>
  );
};


function App() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    rainflow: 0,
    lightIntensity: 0,
    isManualMode: false,
  });

  const [sensorHistory, setSensorHistory] = useState({
    temperature: [],
    humidity: [],
    rainflow: [], // Ensure rainflow is initialized as an empty array
  });

  const [availablePorts, setAvailablePorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Fetch available ports on component mount
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ports");
        const ports = await response.json();
        setAvailablePorts(ports);
      } catch (error) {
        console.error("Error fetching ports:", error);
        setConnectionError("Failed to fetch available ports");
      }
    };

    fetchPorts();
  }, []);

  // Connect to selected port
  const connectToPort = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/connect-port", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ port: selectedPort }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsConnected(true);
        setConnectionError(null);
      } else {
        setConnectionError(result.error || "Failed to connect to port");
      }
    } catch (error) {
      console.error("Error connecting to port:", error);
      setConnectionError("Network error. Unable to connect.");
    }
  };

  // Fetch sensor data
  useEffect(() => {
    if (!isConnected) return;

    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sensor-data");
        const newData = await response.json();

        console.log("Received sensor data:", newData); // Debug log
        console.log("Rainflow value:", newData.rainflow); // Specific rainflow log

        setSensorData(newData);

        setSensorHistory((prevHistory) => {
          // Helper function to update sensor history consistently
          const updateSensorHistory = (history, newValue) => {
            const safeValue = newValue ?? 0; // Ensure a default value
            const newHistoryEntry = { 
              time: new Date().toLocaleTimeString(), 
              value: safeValue 
            };
            const updatedHistory = [...history, newHistoryEntry].slice(-10);
            return updatedHistory;
          };

          const updatedHistory = {
            temperature: updateSensorHistory(prevHistory.temperature, newData.temperature),
            humidity: updateSensorHistory(prevHistory.humidity, newData.humidity),
            rainflow: updateSensorHistory(prevHistory.rainflow, newData.rainflow)
          };

          console.log("Updated sensor history:", updatedHistory); // Debug log for history

          return updatedHistory;
        });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setIsConnected(false);
        setConnectionError("Lost connection to sensor");
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const sendCommand = async (command) => {
    try {
      await fetch("http://localhost:5000/api/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  return (
    <div 
      className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen font-poppins"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {!isConnected ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
            <h2 className="text-2xl mb-4 text-center font-bold text-gray-800">Select COM Port</h2>
            {connectionError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                {connectionError}
              </div>
            )}
            <select 
              value={selectedPort} 
              onChange={(e) => setSelectedPort(e.target.value)}
              className="w-full p-3 border-2 border-blue-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <option value="">Select a port</option>
              {availablePorts.map((port) => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
            <button 
              onClick={connectToPort}
              disabled={!selectedPort}
              className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Connect
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 
            className="text-4xl font-bold text-center mb-6 text-gray-800 bg-white/50 rounded-full inline-block px-6 py-2 mx-auto" 
            style={{display: 'table'}}
          >
            EcoMonitoring System
          </h1>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => sendCommand("MODE:AUTOMATIC")}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${!sensorData.isManualMode ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              Automatic Mode
            </button>
            <button
              onClick={() => sendCommand("MODE:MANUAL")}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${sensorData.isManualMode ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              Manual Mode
            </button>
            <button
              onClick={() => sendCommand("LED1:ON")}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${sensorData.isManualMode ? "bg-gradient-to-r from-green-500 to-green-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              disabled={!sensorData.isManualMode}
            >
              On Water Pump
            </button>
            <button
              onClick={() => sendCommand("LED1:OFF")}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${sensorData.isManualMode ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              disabled={!sensorData.isManualMode}
            >
              Off Water Pump
            </button>
            <button
              onClick={() => sendCommand("LED2:ON")}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${sensorData.isManualMode ? "bg-gradient-to-r from-green-500 to-green-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              disabled={!sensorData.isManualMode}
            >
              On Temperature Alarm
            </button>
            <button
              onClick={() => sendCommand("LED2:OFF")}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${sensorData.isManualMode ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              disabled={!sensorData.isManualMode}
            >
              Off Temperature Alarm
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SensorCard
              title="Temperature"
              color="purple"
              currentValue={sensorData.temperature}
              graphData={sensorHistory.temperature}
              unit="°C"
            />
            <SensorCard
              title="Humidity"
              color="green"
              currentValue={sensorData.humidity}
              graphData={sensorHistory.humidity}
              unit="%"
            />
            <SensorCard
              title="Rainflow"
              color="blue"  // Changed color for better visibility
              currentValue={sensorData.rainflow}
              graphData={sensorHistory.rainflow}
              unit="mm"
            />
            <LightIntensityCard
              title="Light Intensity"
              ldrValue={sensorData.lightIntensity}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;