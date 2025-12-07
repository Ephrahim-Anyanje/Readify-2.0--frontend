import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:8000") +
          "/auth/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store the token
      setToken(data.access_token || data.token);

      // Call onLogin to refresh user data
      await onLogin();

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 420, margin: "28px auto" }} className="card">
        <h2>Login</h2>
        {err && (
          <div style={{ color: "crimson", marginBottom: "12px" }}>{err}</div>
        )}
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={loading}
          />
          <button className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#646cff" }}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
