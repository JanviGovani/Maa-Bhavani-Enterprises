import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // Adjust the import path to your firebase config file if needed
import { ADMIN_EMAILS } from "../adminConfig";

export default function AdminLogin({ onLoginSuccess }) {
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the signed-in user's email is in the admin list
      if (ADMIN_EMAILS.includes(user.email)) {
        onLoginSuccess(user);
      } else {
        setError("Access Denied: You are not authorized as an admin.");
        await auth.signOut(); // Log them out immediately if unauthorized
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
      <h2>Admin Portal Login</h2>
      <button 
        onClick={handleGoogleLogin}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginTop: "20px" }}
      >
        Sign in with Google
      </button>
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
}