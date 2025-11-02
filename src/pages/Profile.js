// src/pages/Profile.js
import React, { useState, useRef } from "react";
import API from "../api";
import "./Profile.css";

function Profile({ user, setUser }) {
  const [profilePic, setProfilePic] = useState(
    user?.profilePic || "https://via.placeholder.com/150?text=Profile+Pic"
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview first
    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);

    // Upload
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", user.id);

    try {
      setUploading(true);
      const res = await API.post("/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.imageUrl) {
        // Update frontend + localStorage
        const updatedUser = { ...user, profilePic: res.data.imageUrl };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setProfilePic(res.data.imageUrl);
        alert("✅ Profile picture updated!");
      } else {
        alert("⚠️ Upload succeeded but no image URL returned.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  return (
    <div className="profile-container">
      <h1>👤 Profile Settings</h1>

      <div className="profile-card">
        <div className="profile-pic-wrapper">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-pic"
            onClick={handleImageClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <p className="change-text">
            {uploading ? "Uploading..." : "Click image to change"}
          </p>
        </div>

        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role || "User"}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
