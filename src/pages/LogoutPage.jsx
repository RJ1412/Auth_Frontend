// src/LogoutPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./logout.css";

const LogoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const logoutUser = async () => {
    try {
      setLoading(true);
      setMessage("Logging you out...");

      await axios.post("http://localhost:5000/api/v1/users/logout", {}, {
        withCredentials: true, 
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Logout failed", error);
      setMessage("Failed to log out. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="logout-page">
      <div className="logout-box">
        <h1 className="logout-title">Logout</h1>

        {message && <p className="logout-message">{message}</p>}
        {loading && <div className="loader"></div>}

        {!loading && (
          <button onClick={logoutUser} className="logout-btn">
            Log out
          </button>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;
