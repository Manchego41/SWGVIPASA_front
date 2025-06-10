import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roles = [] }) {
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  if (!stored || !stored.token) {
    return <Navigate to="/login" replace />;
  }
  // (opcional) si quisieras roles distintos:
  // if (roles.length && !roles.includes(stored.role)) {
  //   return <Navigate to="/acceso-denegado" replace />;
  // }
  return children;
}