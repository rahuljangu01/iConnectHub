import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user and token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        // corrupted localStorage, reset
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // ✅ Signup
  const signup = async (formData) => {
    try {
      await axios.post('http://localhost:5050/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        collegeId: formData.role === 'student' ? formData.collegeId : null,
      });

      return {
        success: true,
        message: 'Signup successful. Please login.',
      };
    } catch (err) {
      console.error("❌ Signup Error:", err.response?.data);
      return {
        success: false,
        error: err.response?.data?.error || 'Signup failed',
      };
    }
  };

  // ✅ Login and store token/user in localStorage
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5050/api/auth/login', {
        email,
        password,
      });

      const { user: userData, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // ✅ Set token for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed',
      };
    }
  };

  // ✅ Logout and clear localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // ✅ Provide all context values
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isClub: user?.role === 'club',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
