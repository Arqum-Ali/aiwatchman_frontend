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

// Navbar component
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
  const hideNavbar = ["/signup", "/Login"].includes(location.pathname);

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
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload_image" element={<UploadReferences />} />
          <Route path="/known-faces" element={<KnownFaces />} />
          <Route path="/UnknownFaces" element={<UnknownFaces />} />
          <Route path="/Camera" element={<Camera />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
