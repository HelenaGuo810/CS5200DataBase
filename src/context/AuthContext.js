import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps your app and makes the auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if there's a stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sign in function
  const login = async (email, password) => {
    try {
      // This would typically be an API call to your backend
      // For now, we'll simulate a successful login
      const userData = { id: '123', name: 'Test User', email, role: 'student' };
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      throw err;
    }
  };

  // Sign out function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      // This would typically be an API call to your backend
      // For now, we'll simulate a successful registration
      const userData = { id: '123', name, email, role: 'student' };
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError('Failed to register. Please try again.');
      throw err;
    }
  };

  // Check if user is an internal student (for booking feature)
  const isInternalStudent = () => {
    return currentUser && currentUser.role === 'student';
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    isInternalStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}