import { useState } from "react";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", otp: "" });
  const [message, setMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState(""); // OTP send status
  const [showOtpInput, setShowOtpInput] = useState(false); // Show OTP input after sending
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification
  const [showOtpFade, setShowOtpFade] = useState(false); // For fade effect

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setOtpMessage(""); // Reset OTP message if email changes
      setShowOtpInput(false);
      setOtpVerified(false);
      setShowOtpFade(false);
    }
  };

  const sendOtp = async () => {
    if (!formData.email) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpMessage("✅ OTP sent to your email!");
        setShowOtpInput(true);
        setShowOtpFade(true);

        // Fade out after 3 seconds
        setTimeout(() => {
          setShowOtpFade(false);
        }, 3000);
      } else {
        setOtpMessage("❌ " + (data.error || "Failed to send OTP"));
        setShowOtpInput(false);
        setShowOtpFade(true);
        setTimeout(() => {
          setShowOtpFade(false);
        }, 3000);
      }
    } catch (error) {
      setOtpMessage("❌ Error: " + error.message);
      setShowOtpInput(false);
      setShowOtpFade(true);
      setTimeout(() => {
        setShowOtpFade(false);
      }, 3000);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP sent to your email.");
      return;
    }

    try {
      const otpResponse = await fetch("http://127.0.0.1:5000/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      const otpData = await otpResponse.json();
      if (otpResponse.ok) {
        setOtpVerified(true);
        setShowOtpInput(false);
        setOtpMessage("");
        alert("✅ OTP verified successfully!");
      } else {
        alert("❌ " + (otpData.error || "Invalid OTP"));
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!otpVerified) {
      alert("Please verify your OTP first!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Signup successful!");
        setFormData({ username: "", email: "", password: "", otp: "" });
        setOtpVerified(false);
        setShowOtpInput(false);
        setOtpMessage("");
        setShowOtpFade(false);
      } else {
        setMessage("❌ " + (data.error || "Something went wrong"));
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <div className="email-wrapper" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={otpVerified} // Disable email after OTP verified
            />
            {!otpVerified && formData.email && (
              <button type="button" onClick={sendOtp} className="otp-btn">
                Send OTP
              </button>
            )}
          </div>

          {otpMessage && (
            <p className={`otp-message ${showOtpFade ? "fade-in" : "fade-out"}`}>
              {otpMessage}
            </p>
          )}

          {showOtpInput && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={verifyOtp} className="otp-btn">
                Verify OTP
              </button>
            </div>
          )}

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

        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
}
