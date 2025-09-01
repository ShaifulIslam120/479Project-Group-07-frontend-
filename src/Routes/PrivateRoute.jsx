// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/signin" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/signin" />; // or show "Not authorized"
  }

  return children;
};

export default PrivateRoute;
