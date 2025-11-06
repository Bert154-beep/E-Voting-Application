import React from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

    console.log("ProtectedRoute user:", user);
  
  if(!user){
    return <Navigate to="/" replace/>
  }

  if (!user.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
