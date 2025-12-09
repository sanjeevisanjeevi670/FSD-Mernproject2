// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userLoggedIn = !!localStorage.getItem("userData");
  return userLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
