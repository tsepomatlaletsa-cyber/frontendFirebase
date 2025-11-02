import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toggleSidebar();
    navigate("/"); 
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        left: isOpen ? 0 : "-250px",
        width: "250px",
        height: "calc(100% - 60px)",
        backgroundColor: "#121212",
        color: "#fff",
        transition: "left 0.3s ease",
        zIndex: 900,
        paddingTop: "20px",
        boxShadow: isOpen ? "4px 0 10px rgba(185, 79, 79, 0.5)" : "none",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", 
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <Link to="/" onClick={toggleSidebar} style={linkStyle}>
            🏠 Home
          </Link>
        </li>
        <li>
          <Link to="/movies" onClick={toggleSidebar} style={linkStyle}>
            🔥 All Movies
          </Link>
        </li>
        <li>
          <Link to="/movies" onClick={toggleSidebar} style={linkStyle}>
            ⭐ Top Rated
          </Link>
        </li>
        <li>
          <Link to="/movies" onClick={toggleSidebar} style={linkStyle}>
            🆕 New Releases
          </Link>
        </li>
        
        {/* Settings Section */}
        <li
          style={{
            marginTop: "20px",
            borderTop: "1px solid #333",
            paddingTop: "10px",
          }}
        >
          <Link
            to={user ? "/profile" : "/login"}
            onClick={toggleSidebar}
            style={linkStyle}
          >
            ⚙️ Settings
          </Link>
        </li>
      </ul>

      {/* Bottom button: Login or Logout dynamically */}
      <div style={{ margin: "20px" }}>
        {user ? (
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px 15px",
              backgroundColor: "#e50914",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            🔓 Logout
          </button>
        ) : (
          <Link
            to="/login"
            onClick={toggleSidebar}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 15px",
              backgroundColor: "#ffc107",
              color: "#121212",
              textAlign: "center",
              borderRadius: "5px",
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            🔐 Login
          </Link>
        )}
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#ffc107",
  display: "block",
  padding: "12px 18px",
  textDecoration: "none",
  fontWeight: 500,
  transition: "background 0.3s, color 0.3s",
};

export default Sidebar;
