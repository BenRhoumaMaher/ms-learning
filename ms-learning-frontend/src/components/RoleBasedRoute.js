import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = token ? JSON.parse(atob(token.split('.')[1])): null;
  const userRoles = user?.roles || [];

  const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;