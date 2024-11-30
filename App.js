import React, { useState, useEffect } from "react";
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

// SensorCard component
const SensorCard = ({ title, color, currentValue, graphData, unit }) => {
  const safeCurrentValue = currentValue ?? 0;
  const safeGraphData = graphData.length > 0 ? graphData : [{ time: "", value: 0 }];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="w-full flex flex-col space-y-4">
        {/* Radial Gauge */}
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

        {/* Line Graph */}
        <div className="w-full">
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
      </div>
    </div>
  );
};

// LightIntensityCard component
const LightIntensityCard = ({ title, ldrValue }) => {
  const isDay = ldrValue === 0; // Day if LDR value indicates light (1 -> dark, 0 -> bright)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      </div>
      <br></br><br></br><br></br>
      <div className="w-full h-48 flex justify-center items-center relative">
        {isDay ? (
          <div className="w-full h-full bg-blue-200 rounded-lg flex justify-center items-center relative overflow-hidden">
            <div className="absolute w-24 h-24 bg-yellow-300 rounded-full animate-pulse" />
            <p className="absolute text-blue-900 font-bold text-xl mt-32">LIGHT</p>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-lg flex justify-center items-center relative overflow-hidden">
            <div className="absolute w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="absolute top-10 right-10 w-2 h-2 bg-gray-300 rounded-full animate-ping"></div>
            <div className="absolute top-16 left-16 w-3 h-3 bg-gray-300 rounded-full animate-ping"></div>
            <p className="absolute text-white font-bold text-xl mt-32">DARK</p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    rainflow:   0,
    lightIntensity: 0,
  });

  const [sensorHistory, setSensorHistory] = useState({
    temperature: [],
    humidity: [],
    rainflow: [],
  });

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sensor-data");
        const newData = await response.json();

        setSensorData({
          temperature: newData.temperature ?? 0,
          humidity: newData.humidity ?? 0,
          rainflow: newData.rainflow ?? 0,
          lightIntensity: newData.lightIntensity ?? 0,
        });

        setSensorHistory((prevHistory) => ({
          temperature: [
            ...prevHistory.temperature,
            { time: new Date().toLocaleTimeString(), value: newData.temperature ?? 0 },
          ].slice(-10),
          humidity: [
            ...prevHistory.humidity,
            { time: new Date().toLocaleTimeString(), value: newData.humidity ?? 0 },
          ].slice(-10),
          rainflow: [
            ...prevHistory.rainflow,
            { time: new Date().toLocaleTimeString(), value: newData.rainflow ?? 0 },
          ].slice(-10),
        }));
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins">
      <h1 className="text-4xl font-bold text-center mb-6">Sensor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SensorCard
          title="Temperature"
          color="#8884d8"
          currentValue={sensorData.temperature}
          graphData={sensorHistory.temperature}
          unit="°C"
        />
        <SensorCard
          title="Humidity"
          color="#82ca9d"
          currentValue={sensorData.humidity}
          graphData={sensorHistory.humidity}
          unit="%"
        />
        <SensorCard
          title="Rainflow"
          color="#ffc658"
          currentValue={sensorData.rainflow}
          graphData={sensorHistory.rainflow}
          unit="mm"
        />
        <LightIntensityCard
          title="Light Intensity"
          ldrValue={sensorData.lightIntensity}
        />
      </div>
    </div>
  );
}

export default App;
