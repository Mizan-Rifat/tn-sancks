import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Parse from 'parse';

const AuthProtectedRoute = () => {
  const currentUser = Parse.User.current();
  return currentUser ? <Outlet /> : <Navigate to="lofhfgthgin" />;
};

export default AuthProtectedRoute;
