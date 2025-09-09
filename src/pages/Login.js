import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import "./Signup.css"; // reuse the same CSS for consistent styling

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // For login messages
  const [showFade, setShowFade] = useState(false); // For fade effect
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setShowFade(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("❌ Please fill in all fields");
      setShowFade(true);
      setTimeout(() => setShowFade(false), 3000);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Login successful!");
        setShowFade(true);
        setFormData({ email: "", password: "" });

        setTimeout(() => {
          setShowFade(false);
          navigate("/"); // ✅ redirect to Home
        }, 1000); // short delay to show success message
      } else {
        setMessage("❌ " + (data.error || "Login failed"));
        setShowFade(true);
        setTimeout(() => setShowFade(false), 3000);
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
      setShowFade(true);
      setTimeout(() => setShowFade(false), 3000);
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
      </div>
    </div>
  );
}
