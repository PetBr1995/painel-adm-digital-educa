// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get('https://api.digitaleduca.com.vc/auth/check', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user || { token });
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const res = await axios.post('https://api.digitaleduca.com.vc/auth/login', credentials);
    const token = res.data.token;
    localStorage.setItem('token', token);
    await verifyToken(token);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);