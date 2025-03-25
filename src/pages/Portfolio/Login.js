import React, { useState } from "react";
// import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Check if passwords match during registration
    if (!isLogin && password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // For demonstration - in a real app, you'd call an authentication service
    if (isLogin) {
      // Login logic would go here
      console.log("Logging in with:", { email, password });
      alert("Login successful! Redirecting to student dashboard...");
      // Redirect to dashboard or portfolio page
      window.location.href = "/portfolio/dashboard";
    } else {
      // Register logic would go here
      console.log("Registering with:", { email, password });
      alert("Registration successful! Please check your email for verification.");
      setIsLogin(true);
      setVerifyPassword("");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setVerifyPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Student Login" : "Create Account"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="verifyPassword">Verify Password</label>
              <input
                type="password"
                id="verifyPassword"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          
          {isLogin && (
            <div className="forgot-password">
              <a href="/portfolio/reset-password">Forgot password?</a>
            </div>
          )}
          
          <button type="submit" className="login-button">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        
        <div className="login-footer">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Register
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 