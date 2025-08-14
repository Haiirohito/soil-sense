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
      setName(userName || "");
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const data = await getCalculationHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setHistory([]);
    }
  };

  const handleView = (calc) => {
    // keep a fallback copy in case navigation state is lost on refresh
    localStorage.setItem("viewCalc", JSON.stringify(calc));
    navigate("/view-calculation", { state: { calc } });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Welcome, {name} 👋</h1>

        <div className="dashboard-actions" style={{ marginTop: 12, marginBottom: 12 }}>
          <button className="new-calc-btn" onClick={() => navigate("/calculation")}>
            ➕ New Calculation
          </button>
        </div>

        <div className="dashboard-grid">
          {history.length === 0 ? (
            <p>No previous calculations</p>
          ) : (
            history.map((c) => {
              const timestamp = c.createdAt
                ? new Date(c.createdAt).toLocaleString()
                : "—";

              // results is an object keyed by year strings: { "2020": {...}, "2021": {...} }
              const yearKeys = c.results ? Object.keys(c.results) : [];
              const firstYear = yearKeys.length ? yearKeys.sort()[0] : null;
              const indexList = firstYear && c.results[firstYear]
                ? Object.keys(c.results[firstYear]).join(", ")
                : "No results";

              // we’ll pass geometry + results only; the view page derives years
              const viewPayload = {
                geometry: c.geometry?.[0]?.geometry || null,
                results: c.results || {},
              };

              return (
                <div className="dashboard-tile" key={c._id}>
                  <MiniMap geometry={c.geometry?.[0]?.geometry} />
                  <div className="tile-details">
                    <p><strong>🕒 Created:</strong> {timestamp}</p>
                    <p><strong>📈 Indices:</strong> {indexList}</p>
                    <button onClick={() => handleView(viewPayload)}>
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
