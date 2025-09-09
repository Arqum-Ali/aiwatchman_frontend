import React from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Users from "./pages/Users";
import Signup from "./pages/Signup";
import UploadReferences from "./pages/upload_image";
import Login from "./pages/Login";
import KnownFaces from "./pages/KnowFaces";
import UnknownFaces from "./pages/UnknowFaces";
import Camera from "./pages/camera";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";


function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">AI WatchMan</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
        </li>
       
        <li>
          <NavLink to="/upload_image" className="nav-link">
            Upload
          </NavLink>
        </li>
          <li>
          <NavLink to="/known-faces" className="nav-link">
            KnownFaces
          </NavLink>
        </li>
         <li>
          <NavLink to="/UnknownFaces" className="nav-link">
            UnKnownFaces
          </NavLink>
        </li>
          <li>
          <NavLink to="/Camera" className="nav-link">
            Camera
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

// Wrapper component to conditionally show navbar
function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/signup", "/login"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/upload_image"
            element={
              <ProtectedRoute>
                <UploadReferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/known-faces"
            element={
              <ProtectedRoute>
                <KnownFaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UnknownFaces"
            element={
              <ProtectedRoute>
                <UnknownFaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Camera"
            element={
              <ProtectedRoute>
                <Camera />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
