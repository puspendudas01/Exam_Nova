import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const storedUser = localStorage.getItem('examportal_user');
  const storedToken = localStorage.getItem('token');
  const storedRefresh = localStorage.getItem('refreshToken');

  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken || null);
  const [refreshToken, setRefreshToken] = useState(storedRefresh || null);

  // ✅ LOGIN
  const login = useCallback((response) => {

    const userData = {
      userId: response.userId,
      email: response.email,
      fullName: response.fullName,
      role: response.role,
      approved: response.approved
    };

    localStorage.setItem('examportal_user', JSON.stringify(userData));
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);

    setUser(userData);
    setToken(response.token);
    setRefreshToken(response.refreshToken);

  }, []);

  // ✅ LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('examportal_user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    setUser(null);
    setToken(null);
    setRefreshToken(null);
  }, []);

  const isRole = useCallback((r) => user?.role === r, [user]);

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}