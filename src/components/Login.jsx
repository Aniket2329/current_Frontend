import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Save JWT
        setMessage("Login successful! 🎉");
        navigate("/add_product"); // Redirect to AddProduct page
      } else {
        setMessage("Login failed: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error(error);
      setMessage("Wrong Credentials!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageClass = message
    ? message.toLowerCase().includes("success")
      ? "login-message login-message--success"
      : "login-message login-message--error"
    : "";

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to access your dashboard.</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="login-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
        {message && <p className={messageClass}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;

