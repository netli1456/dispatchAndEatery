// utils/ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, element, ...rest }) => {
  return user ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;
