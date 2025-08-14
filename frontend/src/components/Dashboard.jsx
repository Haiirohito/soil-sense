import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "./Navbar";
import { getCalculationHistory } from "./api";
import MiniMap from "./minimap";

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");

    if (!token) {
      navigate("/");
    } else {
      setName(userName);
      fetchHistory();
    }
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const data = await getCalculationHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleView = (calc) => {
    localStorage.setItem("viewCalc", JSON.stringify(calc));
    navigate("/view-calculation", { state: { calc } });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Welcome, {name} 👋</h1>
        <div className="dashboard-actions">
          <button
            className="new-calc-btn"
            onClick={() => navigate("/calculation")}
          >
            ➕ New Calculation
          </button>
        </div>
        <div className="dashboard-grid">
          {history.length === 0 ? (
            <p>No previous calculations</p>
          ) : (
            history.map((c) => {
              const timestamp = new Date(c.createdAt).toLocaleString();
              const indexList = c.result && typeof c.result === "object"
                ? Object.keys(c.result).join(", ")
                : "No results";
              const years = [];
              for (let y = c.startYear; y <= c.endYear; y++) {
                years.push(y);
              }

              return (
                <div className="dashboard-tile" key={c._id}>
                  <MiniMap geometry={c.geometry?.[0]?.geometry} />
                  <div className="tile-details">
                    <p>
                      <strong>🕒 Created:</strong> {timestamp}
                    </p>
                    <p>
                      <strong>📈 Indices:</strong> {indexList}
                    </p>
                    <button
                      onClick={() =>
                        handleView({
                          geometry: c.geometry?.[0]?.geometry,
                          result: c.result,
                          years,
                        })
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
