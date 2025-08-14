import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DrawMap from "../DrawMap";
import Navbar from "./Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const indexColors = {
  NDVI: "#4caf50",
  NDMI: "#03a9f4",
  NDSI: "#ff9800",
  GCI: "#9c27b0",
  EVI: "#f44336",
  AWEI: "#607d8b",
};

const interpretation = (index, value) => {
  if (value === null || value === undefined) return "No data available";
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return "Invalid data";
  const formattedValue = numericValue.toFixed(2);

  switch (index) {
    case "NDVI":
      if (numericValue > 0.6) return `NDVI ${formattedValue} indicates dense healthy vegetation.`;
      if (numericValue > 0.3) return `NDVI ${formattedValue} indicates sparse vegetation.`;
      return `NDVI ${formattedValue} indicates little to no vegetation.`;
    case "NDMI":
      return `NDMI ${formattedValue} suggests ${numericValue > 0 ? "moisture present" : "dry conditions"}.`;
    case "NDSI":
      return `NDSI ${formattedValue} implies ${numericValue > 0.2 ? "snow/ice presence" : "bare ground or vegetation"}.`;
    case "GCI":
      return `GCI ${formattedValue} indicates chlorophyll concentration; higher is greener.`;
    case "EVI":
      return `EVI ${formattedValue} suggests ${numericValue > 0.5 ? "healthy vegetation" : "low vegetation density"}.`;
    case "AWEI":
      return `AWEI ${formattedValue} indicates ${numericValue > 0 ? "potential water presence" : "no water detected"}.`;
    default:
      return `${index} value: ${formattedValue}`;
  }
};

const ViewCalculation = () => {
  const location = useLocation();
  const [geometry, setGeometry] = useState(null);
  const [results, setResults] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("NDVI");

  useEffect(() => {
    // prefer navigation state; fallback to localStorage
    const fromState = location.state?.calc;
    const fallback = !fromState && localStorage.getItem("viewCalc")
      ? JSON.parse(localStorage.getItem("viewCalc"))
      : null;

    const calc = fromState || fallback;

    if (calc) {
      setGeometry(calc.geometry || null);
      setResults(calc.results || null);

      if (calc.results && typeof calc.results === "object") {
        const sortedYears = Object.keys(calc.results)
          .filter((y) => !isNaN(Number(y)))
          .map((y) => Number(y))
          .sort((a, b) => a - b);
        setYears(sortedYears);
      } else {
        setYears([]);
      }
    }
  }, [location]);

  const chartData = years.map((year) => ({
    year,
    value: results?.[year]?.[selectedIndex] ?? null,
  }));

  return (
    <div className="app-root">
      <Navbar />
      <div className="app-dashboard">
        <aside className="map-section">
          <div className="map-container-wrapper">
            <DrawMap preloadedGeometry={geometry} viewOnly />
          </div>
        </aside>

        <main className="info-section">
          <div className="control-panel">
            <div className="control-group">
              <label>Vegetation Index</label>
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
              >
                {Object.keys(indexColors).map((index) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results && years.length > 0 ? (
            <div className="results-container">
              <div className="interpretation-panel">
                <h3>{selectedIndex} Analysis</h3>
                <div className="interpretation-list">
                  {years.map((year) => (
                    <div key={year} className="interpretation-item">
                      <strong>{year}:</strong>{" "}
                      {interpretation(selectedIndex, results?.[year]?.[selectedIndex])}
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <h3>{selectedIndex} Trend Visualization</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="year" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={indexColors[selectedIndex]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div style={{ padding: 16 }}>No results to display.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewCalculation;
