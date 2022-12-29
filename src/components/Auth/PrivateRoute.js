import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser !== "loading") {
    return currentUser ? children : <Navigate to="/login" />;
  } else {
    return <Navigate to="/" />;
  }
}
