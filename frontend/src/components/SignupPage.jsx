import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup, googleLogin } from "./api";
import "./SignupPage.css";
import "./common.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      alert("Signup successful. Please login.");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div className="container">
      <div className="signup-container">
        <div className="signup-box">
          <h1>Sign Up Form</h1>
          <p>Please enter your details.</p>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input type="text" name="name" placeholder="Enter your username" onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />

            <button type="submit">Sign Up</button>
          </form>

          <div className="social-btn" onClick={googleLogin}>
            <img src="/images/google.png" alt="Google Login" />
            Sign in with Google
          </div>

          <p className="signin-text">
            Go back to, <Link to="/">Sign In</Link>
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

export default SignupPage;
