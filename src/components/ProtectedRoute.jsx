// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("sb-access-token"); // ya supabase auth token
  const userRole = localStorage.getItem("user-role");

  if (!token) {
    // User logged in nahi hai, login page pe redirect
    console.log("un");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Agar logged in hai, children render karo
  return children;
}
