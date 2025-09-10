import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home";
import Users from "./pages/Users";
import Signup from "./pages/Signup";
import UploadReferences from "./pages/upload_image";
import Login from "./pages/Login";
import KnownFaces from "./pages/KnowFaces";
import UnknownFaces from "./pages/UnknowFaces";
import Camera from "./pages/camera";
import { rolePages, ROLES } from "./config/roles";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

function Navbar() {
    const role = localStorage.getItem("user-role");

    const pages = role ? rolePages[role] : [];
  return (
    <nav className="navbar">
      <div className="logo">AI WatchMan</div>
      <ul className="nav-links">
        {pages.includes("/") && (
          <li>
            <NavLink to="/" className="nav-link" end>
              Home
            </NavLink>
          </li>
        )}

        {pages.includes("/upload_image") && (
          <li>
            <NavLink to="/upload_image" className="nav-link">
              Upload
            </NavLink>
          </li>
        )}

        {pages.includes("/known-faces") && (
          <li>
            <NavLink to="/known-faces" className="nav-link">
              KnownFaces
            </NavLink>
          </li>
        )}

        {pages.includes("/UnknownFaces") && (
          <li>
            <NavLink to="/UnknownFaces" className="nav-link">
              UnKnownFaces
            </NavLink>
          </li>
        )}

        {pages.includes("/Camera") && (
          <li>
            <NavLink to="/Camera" className="nav-link">
              Camera
            </NavLink>
          </li>
        )}

        {pages.includes("/users") && (
          <li>
            <NavLink to="/users" className="nav-link">
              User
            </NavLink>
          </li>
        )}
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
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.VIEWER]}
              >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.VIEWER]}
              >
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/upload_image"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.VIEWER]}
              >
                <UploadReferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/known-faces"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}
              >
                <KnownFaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UnknownFaces"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}
              >
                <UnknownFaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Camera"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.VIEWER]}
              >
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
