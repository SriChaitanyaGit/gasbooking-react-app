import React, { useState, useEffect } from "react";
import "./Customerprofile.css";

export default function Customerprofile() {
  const [profile, setProfile] = useState({});
  const [originalProfile, setOriginalProfile] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    if (!email || !password) {
      window.location.href = "/login";
      return;
    }

    fetch("/api/customer-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfile(data.data);
          setOriginalProfile(data.data);
        } else {
          setMessage(data.message);
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Failed to load profile.");
        setMessageType("error");
      });
  }, []);

  const updateProfile = (e) => {
    e.preventDefault();

    const hasChanges =
      profile.name !== originalProfile.name ||
      profile.phone !== originalProfile.phone ||
      profile.role !== originalProfile.role;

    if (!hasChanges) {
      setMessage("Details are up to date.");
      setMessageType("success");
      return;
    }

    fetch("/api/customer-profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setOriginalProfile({ ...profile });
          setMessage("Profile updated successfully.");
          setMessageType("success");
        } else {
          setMessage(data.message);
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Failed to update profile.");
        setMessageType("error");
      });
  };

  const updatePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword === profile.password) {
      setMessage("Enter a new password different from the current one.");
      setMessageType("error");
      return;
    }

    fetch("/api/update-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        newPassword: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfile((prev) => ({ ...prev, password: newPassword }));
          setNewPassword("");
          setConfirmPassword("");
          setMessage("Password updated successfully.");
          setMessageType("success");
        } else {
          setMessage(data.message);
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Failed to update password.");
        setMessageType("error");
      });
  };

  return (
    <div className="cp-container">
      <h2 className="cp-title">Your Profile</h2>

      {message && <div className={`cp-message cp-${messageType}`}>{message}</div>}

      {profile && profile.name && (
        <>
          <form onSubmit={updateProfile} className="cp-form">
            <label>Name</label>
            <input
              type="text"
              className="cp-input"
              value={profile.name || ""}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              required
            />

            <label>Email</label>
            <input type="email" className="cp-input" value={profile.email || ""} readOnly />

            <label>Phone</label>
            <input
              type="text"
              className="cp-input"
              value={profile.phone || ""}
              onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />

            <label>Role</label>
            <input type="text" className="cp-input" value={profile.role || ""} readOnly />

            <button type="submit" className="cp-btn cp-btn--primary">Update Profile</button>
          </form>

          <hr className="cp-divider" />

          <form onSubmit={updatePassword} className="cp-form">
            <label>New Password</label>
            <input
              type="password"
              className="cp-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              className="cp-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="cp-btn cp-btn--outline">Update Password</button>
          </form>
        </>
      )}
    </div>
  );
}
