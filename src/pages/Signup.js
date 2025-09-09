import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showFade, setShowFade] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setShowFade(false);
  };

 const handleSignup = async (e) => {
   e.preventDefault();

   const { data, error } = await supabase.auth.signUp({
     email: formData.email,
     password: formData.password,
   });

   if (error) {
     setMessage("❌ " + error.message);
   } else {
     setMessage("✅ Signup successful! Check your email to confirm.");
     setTimeout(() => navigate("/login"), 2000);
   }
 };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <form onSubmit={handleSignup} className="signup-form">
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
            Sign Up
          </button>
        </form>
        {message && (
          <p className={`signup-message ${showFade ? "fade-in" : "fade-out"}`}>
            {message}
          </p>
        )}
        <p className="mt-2 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
