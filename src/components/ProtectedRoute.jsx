import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api.js';
import LoadingScreen from './LoadingScreen.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const [status, setStatus] = useState('verifying'); // verifying | valid | invalid

  useEffect(() => {
    const token = localStorage.getItem('domus_token');
    if (!token) { setStatus('invalid'); return; }

    api.get('/auth/verify')
      .then(() => setStatus('valid'))
      .catch(() => {
        localStorage.removeItem('domus_token');
        localStorage.removeItem('domus_user');
        setStatus('invalid');
      });
  }, []);

  if (status === 'verifying') return <LoadingScreen message="Verificando sesión..." />;
  if (status === 'invalid')   return <Navigate to="/login" replace />;

  if (allowedRoles) {
    try {
      const user = JSON.parse(localStorage.getItem('domus_user') || '{}');
      if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
