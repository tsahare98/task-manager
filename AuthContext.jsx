import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialize and check token validity
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await api.auth.me();
          setUser(profile);
          // Establish WebSocket sync
          wsService.connect(token);
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
    
    return () => {
      wsService.disconnect();
    };
  }, []);
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      wsService.connect(data.token);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      wsService.connect(data.token);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    wsService.disconnect();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
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
