import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch logged in user details on initial load if token exists
  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await API.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to load user session:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.success) {
      const { token: jwtToken, user: userData } = response.data;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
    }
    return response.data;
  };

  const register = async (formData) => {
    const response = await API.post('/auth/register', formData);
    if (response.data.success) {
      const { token: jwtToken, user: userData } = response.data;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
    }
    return response.data;
  };

  const updateProfile = async (formData) => {
    const response = await API.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
        refreshUser: fetchCurrentUser,
        isLoggedIn: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
