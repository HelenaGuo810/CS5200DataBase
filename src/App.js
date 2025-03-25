import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Main Page Components
import HomePage from './pages/HomePage';
import Forum from './pages/Forum/Forum';
import { Login } from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;