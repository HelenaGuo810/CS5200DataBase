import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Main Page Components
import HomePage from './pages/HomePage';
import Forum from './pages/Forum/Forum';
import { Login } from './pages/Portfolio';
import Dashboard from './pages/Dashboard/Dashboard';
import Appointment from './pages/Appointment/Appointment';
import Resources from './pages/Resources/Resources';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}

export default App;