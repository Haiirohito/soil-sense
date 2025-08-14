import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <FiMenu className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
        <Link to="/dashboard" className="logo">🌱 SoilSense</Link>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/dashboard">Dashboard</Link>
        {name ? (
          <>
            <button className="btn signout" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/">Sign in</Link>
            <Link to="/register" className="btn signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
