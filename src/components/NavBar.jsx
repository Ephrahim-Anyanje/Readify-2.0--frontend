import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav
      className="card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/dashboard">
          <strong>Readify</strong>
        </Link>
        <Link to="/library">Library</Link>
        <Link to="/activity">Activity</Link>
      </div>
      <div>
        {user ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/profile">{user.full_name || user.username}</Link>
            <button onClick={logout} className="button">
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
