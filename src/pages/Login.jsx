import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
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
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setToken(data.access_token || data.token);
      await onLogin();
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 420, margin: "28px auto" }} className="card">
        <h2>Login</h2>
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button className="button">Login</button>
        </form>
      </div>
    </div>
  );
}
