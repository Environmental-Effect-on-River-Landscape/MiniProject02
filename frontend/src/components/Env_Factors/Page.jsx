import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const data = [
  { date: "2022-10-11", temperature_max: 28.76, temperature_min: 15.14, precipitation: 0.0, pressure: 1014.03, rain: 0.0 },
  { date: "2022-10-03", temperature_max: 37.15, temperature_min: 21.39, precipitation: 0.0, pressure: 1009.24, rain: 0.0 },
  { date: "2023-05-01", temperature_max: 33.94, temperature_min: 20.04, precipitation: 0.8, pressure: 1011.88, rain: 0.8 },
  { date: "2025-12-24", temperature_max: 27.94, temperature_min: 15.94, precipitation: 0.13, pressure: 1014.15, rain: 0.13 },
  { date: "2024-01-04", temperature_max: 38.5, temperature_min: 24.34, precipitation: 0.76, pressure: 1008.0, rain: 0.76 }
];

// Format dates for better display
const formattedData = data.map(item => ({
  ...item,
  formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}));

// Sort data by date
const sortedData = [...formattedData].sort((a, b) => new Date(a.date) - new Date(b.date));

const RiverBarChart = () => {
  const [displayData, setDisplayData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("temperature_max");
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Colors for different metrics
  const colorMap = {
    temperature_max: "#FF6B6B",
    temperature_min: "#48BFE3",
    precipitation: "#06D6A0",
    pressure: "#9381FF",
    rain: "#4CC9F0"
  };
  
  // Animation to progressively load the bars
  useEffect(() => {
    setDisplayData([]);
    const timer = setTimeout(() => {
      setDisplayData(sortedData);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedMetric]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.formattedDate}</p>
          <div className="mt-2">
            <p className="text-sm">
              <span className="font-medium">Max Temp:</span> {data.temperature_max}°C
            </p>
            <p className="text-sm">
              <span className="font-medium">Min Temp:</span> {data.temperature_min}°C
            </p>
            <p className="text-sm">
              <span className="font-medium">Precipitation:</span> {data.precipitation} mm
            </p>
            <p className="text-sm">
              <span className="font-medium">Pressure:</span> {data.pressure} hPa
            </p>
            <p className="text-sm">
              <span className="font-medium">Rain:</span> {data.rain} mm
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Normalize the pressure value to display on the same scale as other metrics
  const normalizeValue = (value, metric) => {
    if (metric === "pressure") {
      return (value - 1000) * 5; // Scale pressure to be visible alongside other metrics
    }
    return value;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Environmental Factor Comparison</h2>
      
      {/* Metric Selection Buttons */}
      <div className="flex flex-wrap justify-center mb-6 gap-2">
        {Object.keys(colorMap).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedMetric === metric 
                ? "bg-blue-600 text-white shadow-md transform scale-105" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {metric.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
          </button>
        ))}
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="formattedDate" 
              angle={-45} 
              textAnchor="end"
              height={60}
              tick={{ fill: '#4a5568', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#4a5568', fontSize: 12 }}
              label={{ 
                value: selectedMetric.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#4a5568' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => value.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
            />
            <Bar 
              dataKey={(data) => normalizeValue(data[selectedMetric], selectedMetric)}
              name={selectedMetric}
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseEnter={(data, index) => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={colorMap[selectedMetric]}
                  fillOpacity={hoveredBar === index ? 1 : 0.7}
                  className="transition-all duration-300"
                  style={{
                    filter: hoveredBar === index ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))' : 'none',
                    transform: hoveredBar === index ? 'translateY(-5px)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Data sorted chronologically. Hover over bars for detailed information.</p>
      </div>
    </div>
  );
};

export default RiverBarChart;