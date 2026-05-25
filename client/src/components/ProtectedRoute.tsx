import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = () => {
  // Destructure user data and loading state from the AuthContext [3]
  const { user, loading } = useAuth();

  // If the authentication state is still being determined (e.g., checking localStorage), 
  // display the loading spinner [3]
  if (loading) {
    return <Loading />;
  }

  // If no user is logged in, redirect them to the login page. 
  // 'replace' is used so the user can't go back to the protected route via the browser back button [3, 4]
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child routes [2]
  return <Outlet />;
};

export default ProtectedRoute;