import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ toggleSidebar, user, setUser, onSearch }) {
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) {
      onSearch(value); 
    }
  };

  return (
    <header className="app-header">
      {/* Left: Hamburger + Logo */}
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>☰</button>
        <Link to="/" className="logo">🎬 V-whatch</Link>
      </div>

      {/* Center: Search Bar */}
      <div className="header-center">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search movies..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Right: User Options */}
      <div className="header-right">
        {user ? (
          <div className="user-options">
            <Link to="/profile" className="btn btn-profile">{user.name || "Profile"}</Link>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        ) : (
          <div className="user-options">
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
