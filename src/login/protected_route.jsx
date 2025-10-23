import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthState } from './authState'; // Adjust path if needed

export function ProtectedRoute({ authState, children }) {
  if (authState === AuthState.Authenticated) {
    return children;
  } else {
    return <Navigate to='/' />;
  }
}