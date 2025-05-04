import React, { useState } from "react";
import { motion } from "framer-motion";
import "./AuthPage.css";
import axios from "axios";  
import instagram from "../images/instagram_dark.jpg";
import github from "../images/github_dark.png";
import linkdin from "../images/linkedin_dark.jpg";
import { useNavigate } from "react-router-dom";



export default function AuthPage() {
  const BASE_URL = "https://auth-backend-zfgk.vercel.app/api/v1/users";
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "", username: "" });
  const [step, setStep] = useState("auth");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: "", password: "", name: "", username: "" });
    setMessage("");
  };

  // Helper function to extract error message
  const extractMessage = (err, fallback = "Something went wrong") =>
    err?.response?.data?.message || err?.message || fallback;

  const handleAuth = async () => {
    if (!form.email || !form.password || (!isLogin && (!form.name || !form.username))) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true); 
      const url = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/register`;

      const res = await axios.post(url, isLogin ? { email: form.email, password: form.password } : form, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data;
      setMessage(data.message || "Success");

      if (!isLogin) {
        setStep("verify"); 
      }
       else {
        navigate("/logout");
      }
    } catch (error) {
      setMessage(extractMessage(error));
    } finally {
      setLoading(false); 
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/verify-account`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Account verified successfully.");
        navigate("/logout");
      } else {
        setMessage(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setMessage("Error during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setStep("reset");
    } catch (err) {
      setMessage("Error sending reset OTP.");
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !otp || !newPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp, newPassword }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setStep("auth");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="dashboard-title"
        >
          Your Dev Universe<br /> Stay Updated! Stay Ahead!
        </motion.h1>

        {step === "auth" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="form-box"
          >
            <h2 className="form-title">{isLogin ? "Login" : "Register"}</h2>

            {!isLogin && (
              <>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-input" />
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="form-input" />
              </>
            )}

            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-input" />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="form-input" />

            {isLogin && (
              <p
                className="forgot-password-link"
                onClick={() => setStep("forgot")}
              >
                Forgot Password?
              </p>
            )}

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleAuth} className="auth-button" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Login" : "Register")}
            </motion.button>

            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleMode} className="toggle-button">
                {isLogin ? " Register" : " Login"}
              </button>
            </p>
          </motion.div>
        )}

        {step === "verify" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="form-box"
          >
            <h3 className="form-title">Verify OTP</h3>
            <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-input" />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleVerifyOtp} className="auth-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </motion.button>
          </motion.div>
        )}

        {message && <p className="message-text">{message}</p>}

        {step === "forgot" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="form-box"
          >
            <h3 className="form-title">🔐 Forgot Password?</h3>
            <p className="form-subtitle">Enter your email to receive a reset OTP.</p>
            <input
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="form-input"
              type="email"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleForgotPassword}
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP 📩"}
            </motion.button>
            <button onClick={() => setStep("auth")} className="toggle-button">
              ← Back to Login
            </button>
          </motion.div>
        )}

        {step === "reset" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="form-box"
          >
            <h3 className="form-title">Reset Password</h3>
            <p className="form-subtitle">Enter the OTP you received and set a new password.</p>
            <input
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="form-input"
              type="email"
            />
            <input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-input"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetPassword}
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
            <button onClick={() => setStep("auth")} className="toggle-button">
              ← Back to Login
            </button>
          </motion.div>
        )}
      </div>

      <footer className="footer">
        <p>Created by RJ </p>
        <p>© All Rights Reserved</p>
        <div className="social-icons">
          <a href="https://www.instagram.com/tranquil.paradox/" target="_blank" rel="noopener noreferrer">
            <img src={instagram} alt="Instagram" className="social-icon" />
          </a>
          <a href="https://github.com/RJ1412" target="_blank" rel="noopener noreferrer">
            <img src={github} alt="GitHub" className="social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/rj1412/" target="_blank" rel="noopener noreferrer">
            <img src={linkdin} alt="LinkedIn" className="social-icon" />
          </a>
        </div>
      </footer>
    </div>
  );
}
