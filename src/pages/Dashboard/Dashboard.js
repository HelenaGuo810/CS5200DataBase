import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../routes/Navigation/NavBar';
import './Dashboard.css';

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000'; // Change this to the URL where your backend is running

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      console.log('Token from localStorage:', token);
      console.log('User role from localStorage:', userRole);

      if (!token || !userRole) {
        console.log('No token or user role found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const endpoint = userRole === 'STUDENT' ? '/student/me' : '/mentor/me';
        console.log('Fetching user data from endpoint:', endpoint);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('User data response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from server:', errorData);
          throw new Error(errorData.error || 'Failed to fetch user data');
        }

        const data = await response.json();
        console.log('User data received:', data);
        setUserData(data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Failed to connect to server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="error">Error: {error}</div>
        <div className="error-actions">
          <button onClick={() => navigate('/login')} className="error-button">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {userData?.FirstName}!</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="user-info-card">
          <h2>Your Profile</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ID:</label>
              <span>{userData?.StudentID || userData?.MentorID}</span>
            </div>
            <div className="info-item">
              <label>First Name:</label>
              <span>{userData?.FirstName}</span>
            </div>
            <div className="info-item">
              <label>Last Name:</label>
              <span>{userData?.LastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{userData?.Email}</span>
            </div>
            {userData?.TargetSchool && (
              <div className="info-item">
                <label>Target School:</label>
                <span>{userData.TargetSchool}</span>
              </div>
            )}
            {userData?.Track && (
              <div className="info-item">
                <label>Track:</label>
                <span>{userData.Track}</span>
              </div>
            )}
            {userData?.Specialization && (
              <div className="info-item">
                <label>Specialization:</label>
                <span>{userData.Specialization}</span>
              </div>
            )}
            {userData?.Availability && (
              <div className="info-item">
                <label>Availability:</label>
                <span>{userData.Availability}</span>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-button" onClick={() => navigate('/appointment')}>View Appointments</button>
            <button className="action-button">Update Profile</button>
            <button className="action-button">View Portfolio</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 