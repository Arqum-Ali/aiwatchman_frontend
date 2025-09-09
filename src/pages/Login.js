import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Signup.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showFade, setShowFade] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setShowFade(false);
  };

const handleLogin = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    setMessage("❌ " + error.message);
  } else {
    localStorage.setItem("sb-access-token", data.session.access_token);
    setMessage("✅ Login successful!");
    navigate("/");
  }
};

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Login</h2>
        <form onSubmit={handleLogin} className="signup-form">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">
            Login
          </button>
        </form>
        {message && (
          <p className={`signup-message ${showFade ? "fade-in" : "fade-out"}`}>
            {message}
          </p>
        )}
        <p className="mt-2 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}
