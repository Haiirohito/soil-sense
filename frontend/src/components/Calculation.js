import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const [geometry, setGeometry] = useState(null);
  const [selectedYears, setSelectedYears] = useState([
    2020, 2021, 2022, 2023, 2024,
  ]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("NDVI");
  const [yearRange, setYearRange] = useState([2020, 2024]);

  useEffect(() => {
    if (location.state?.calc) {
      setGeometry(location.state.calc.geometry);
      setResults(location.state.calc.results);
      setSelectedYears(location.state.calc.years);
    }
  }, [location]);

  const indexColors = {
    NDVI: "#4caf50",
    NDMI: "#03a9f4",
    NDSI: "#ff9800",
    GCI: "#9c27b0",
    EVI: "#f44336",
    AWEI: "#607d8b",
    LST: "#ff5722",
  };

  const interpretation = (index, value) => {
    if (value === null || value === undefined) return "No data available";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "Invalid data";

    const formattedValue = numericValue.toFixed(2);

    switch (index) {
      case "NDVI":
        if (numericValue > 0.6)
          return `NDVI ${formattedValue} indicates dense healthy vegetation.`;
        if (numericValue > 0.3)
          return `NDVI ${formattedValue} indicates sparse vegetation.`;
        return `NDVI ${formattedValue} indicates little to no vegetation.`;
      case "NDMI":
        return `NDMI ${formattedValue} suggests ${
          numericValue > 0 ? "moisture present" : "dry conditions"
        }.`;
      case "NDSI":
        return `NDSI ${formattedValue} implies ${
          numericValue > 0.2 ? "snow/ice presence" : "bare ground or vegetation"
        }.`;
      case "GCI":
        return `GCI ${formattedValue} indicates chlorophyll concentration; higher is greener.`;
      case "EVI":
        return `EVI ${formattedValue} suggests ${
          numericValue > 0.5 ? "healthy vegetation" : "low vegetation density"
        }.`;
      case "AWEI":
        return `AWEI ${formattedValue} indicates ${
          numericValue > 0 ? "potential water presence" : "no water detected"
        }.`;
      case "LST":
        return `LST ${formattedValue}°C indicates surface temperature; higher means warmer regions.`;
      default:
        return `${index} value: ${formattedValue}`;
    }
  };

  const handleShape = (shape) => {
    setGeometry(shape);
    setError(null);
  };

  const handleCalculate = async () => {
    if (!geometry) {
      setError("Please draw an area on the map first");
      return;
    }

    try {
      setLoading(true);
      const rangeYears = [];
      for (let y = yearRange[0]; y <= yearRange[1]; y++) {
        rangeYears.push(y);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/calculate",
        {
          geometry: geometry ? [geometry] : [],
          years: rangeYears,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response data:", res.data);

      if (!res.data || res.data.error) {
        setError(res.data?.error || "Invalid response from server");
        setResults(null);
        return;
      }

      setResults(res.data.results);
      setSelectedYears(res.data.years);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while processing the request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar />
      <div className="app-dashboard">
        <aside className="map-section">
          <div className="map-container-wrapper">
            <DrawMap onShapeDrawn={handleShape} />
          </div>
        </aside>

        <main className="info-section">
          <div className="control-panel">
            <div className="control-group">
              <label>Year Range</label>
              <div className="year-range-inputs">
                <input
                  type="number"
                  min="2020"
                  max="2024"
                  value={yearRange[0]}
                  onChange={(e) =>
                    setYearRange([+e.target.value, yearRange[1]])
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  min="2020"
                  max="2024"
                  value={yearRange[1]}
                  onChange={(e) =>
                    setYearRange([yearRange[0], +e.target.value])
                  }
                />
              </div>
            </div>

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

            <button onClick={handleCalculate} disabled={!geometry || loading}>
              {loading ? (
                <>
                  Calculating
                  <span className="loader" />
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {results && Object.keys(results).length > 0 && (
            <div className="results-container">
              <div className="interpretation-panel">
                <h3>{selectedIndex} Analysis</h3>
                <div className="interpretation-list">
                  {selectedYears.map((year) => (
                    <div key={year} className="interpretation-item">
                      <strong>{year}:</strong>{" "}
                      {interpretation(
                        selectedIndex,
                        results[year]?.[selectedIndex]
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <h3>{selectedIndex} Trend Visualization</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={selectedYears.map((year) => ({
                      year,
                      value: results[year]?.[selectedIndex] || null,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, "auto"]} />
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
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
