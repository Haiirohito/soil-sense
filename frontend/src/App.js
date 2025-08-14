import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Calculation from "./components/Calculation";
import Dashboard from "./components/Dashboard";
import ViewCalculation from "./components/ViewCalculation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/calculation" element={<Calculation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-calculation" element={<ViewCalculation />} />
      </Routes>
    </Router>
  );
}

export default App;
