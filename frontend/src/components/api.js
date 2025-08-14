import axios from "axios";

const API_BASE = "http://localhost:5000/auth";

export const login = async ({ username, password }) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  localStorage.setItem("token", data.token);
  localStorage.setItem("name", data.name);
  return data;
};

export const signup = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data;
};

export const getCalculationHistory = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/calculate/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Placeholder functions for Google/Facebook login
export const googleLogin = () => alert("Google login coming soon!");
export const facebookLogin = () => alert("Facebook login coming soon!");
