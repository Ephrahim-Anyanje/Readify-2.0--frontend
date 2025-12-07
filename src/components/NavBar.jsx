import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <nav>
      <div className="container flex items-center justify-between" style={{ padding: "1rem 2rem" }}>
        <div className="flex items-center gap-lg">
          <Link to="/dashboard" style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>
            Readify
          </Link>
          <div className="flex items-center gap-md" style={{ marginLeft: "2rem" }}>
            <Link to="/library" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
              Library
            </Link>
            <Link to="/activity" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
              Activity
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button
            onClick={toggleTheme}
            className="button-ghost button-sm"
            style={{ minWidth: "40px", padding: "0.5rem" }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <>
              <Link to="/profile" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                {user.full_name || user.username}
              </Link>
              <button onClick={logout} className="button button-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="button-ghost button-sm">Login</Link>
              <Link to="/signup" className="button button-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
