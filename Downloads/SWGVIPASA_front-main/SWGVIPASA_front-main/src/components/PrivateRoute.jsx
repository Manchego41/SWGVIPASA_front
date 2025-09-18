import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  console.log('🔐 DEBUG PrivateRoute:');
  console.log('Token:', token);
  console.log('User:', user);
  console.log('Roles requeridos:', roles);
  console.log('Rol del usuario:', user?.role);
  console.log('Tiene acceso:', user && roles.includes(user?.role));

  if (!token) {
    console.log('❌ Redirigiendo: No token');
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.log('❌ Redirigiendo: No user');
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    console.log('❌ Redirigiendo: Rol no autorizado');
    return <Navigate to="/acceso-denegado" replace />;
  }

  console.log('✅ Acceso permitido');
  return children;
}