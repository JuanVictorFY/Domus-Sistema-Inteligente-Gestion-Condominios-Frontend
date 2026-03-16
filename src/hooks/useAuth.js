import { useState, useEffect } from 'react';

const TOKEN_KEY = 'domus_token';
const USER_KEY  = 'domus_user';

export const useAuth = () => {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = (userData, authToken) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin     = user?.role === 'admin'     || user?.role === 'ADMIN';
  const isResident  = user?.role === 'residente'  || user?.role === 'RESIDENTE';
  const isSecurity  = user?.role === 'seguridad'  || user?.role === 'SEGURIDAD';

  return { user, token, login, logout, isAuthenticated, isAdmin, isResident, isSecurity };
};
