import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "../api";
import { login } from "../api/auth";

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
      const { ok, status, data } = await login(username, password);

      if (!ok) {
        throw new Error(data?.detail || "Login failed");
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
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="text-center mb-lg">Login</h2>
        {err && (
          <div className="alert alert-error mb-lg">
            {err}
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col gap-md">
          <div>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-lg">
          <p className="text-secondary">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
