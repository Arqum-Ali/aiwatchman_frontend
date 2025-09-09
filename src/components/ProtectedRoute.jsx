// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sb-access-token"); // ya supabase auth token

  if (!token) {
    // User logged in nahi hai, login page pe redirect
    console.log('un')
    return <Navigate to="/login" replace />;
  }

  // Agar logged in hai, children render karo
  return children;
}
