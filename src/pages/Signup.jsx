import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [full, setFull] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            email: email || null,
            full_name: full || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      setMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 460, margin: "28px auto" }} className="card">
        <h2>Sign up</h2>
        {msg && (
          <div
            style={{
              color: msg.includes("success") ? "green" : "crimson",
              marginBottom: "12px",
            }}
          >
            {msg}
          </div>
        )}
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username *"
            required
            disabled={loading}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            type="email"
            disabled={loading}
          />
          <input
            value={full}
            onChange={(e) => setFull(e.target.value)}
            placeholder="Full name (optional)"
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password *"
            required
            disabled={loading}
          />
          <button className="button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#646cff" }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
