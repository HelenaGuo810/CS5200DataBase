import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000'; // Change this to the URL where your backend is running

const Login = () => {
  const [email, setEmail] = useState("lucas@example.com");
  const [password, setPassword] = useState("test1234");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
    
    try {
      console.log("Submitting form:", { email, password, isLogin });
      
      if (isLogin) {
        // Login logic
        console.log("Attempting login with:", { email, password });
        
        const response = await fetch(`${API_BASE_URL}/student/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        console.log("Login response status:", response.status);
        const data = await response.json();
        console.log("Login response data:", data);

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store the token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.role);

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Register logic
        console.log("Attempting registration with:", { email, password });
        
        const response = await fetch(`${API_BASE_URL}/student/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: email.split('@')[0], // Using email prefix as first name for demo
            lastName: 'User', // Default last name for demo
            email,
            password,
            targetSchool: 'Default School',
            track: 'Default Track'
          }),
        });

        console.log("Registration response status:", response.status);
        const data = await response.json();
        console.log("Registration response data:", data);

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        alert("Registration successful! Please login.");
        setIsLogin(true);
        setVerifyPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to connect to server. Please try again.');
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