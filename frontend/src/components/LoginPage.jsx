import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "./api";
import "./LoginPage.css";
import "./common.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        username: credentials.username,  // Changed from formData to credentials
        password: credentials.password  // Changed from formData to credentials
      });
      console.log("Login success:", response);
      // Handle successful login (redirect, store token, etc.)
      navigate("/dashboard");  // Example redirect after login
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome Back</h1>
          <p>Welcome back, please enter your details.</p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input 
              type="text" 
              name="username" 
              value={credentials.username}
              placeholder="Enter your username" 
              onChange={handleChange} 
              required 
            />

            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={credentials.password}
              placeholder="Enter your password" 
              onChange={handleChange} 
              required 
            />

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me for 30 days
              </label>
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <div className="social-btn" onClick={googleLogin}>
            <img src="/images/google.png" alt="Google Login" />
            Sign in with Google
          </div>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      <div className="right-side">
        <div className="graphics">
          <div className="circle blue"></div>
          <div className="circle red"></div>
          <div className="circle yellow"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;