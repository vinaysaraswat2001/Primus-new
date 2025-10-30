import React from "react";
import { Navigate } from "react-router-dom";
 
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
 
  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
 
  // Logged in, render the requested component
  return children;
};
 
export default ProtectedRoute; 