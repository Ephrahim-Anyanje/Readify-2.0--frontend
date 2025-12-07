import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/auth";

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
      const { ok, data } = await signup(
        username,
        password,
        email || null,
        full || null
      );

      if (!ok) {
        throw new Error(data?.detail || "Signup failed");
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
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div className="card" style={{ maxWidth: 480, width: "100%" }}>
        <h2 className="text-center mb-lg">Create Account</h2>
        {msg && (
          <div className={msg.includes("success") ? "alert alert-success mb-lg" : "alert alert-error mb-lg"}>
            {msg}
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col gap-md">
          <div>
            <label>Username *</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email (optional)"
              type="email"
              disabled={loading}
            />
          </div>
          <div>
            <label>Full Name</label>
            <input
              value={full}
              onChange={(e) => setFull(e.target.value)}
              placeholder="Enter your full name (optional)"
              disabled={loading}
            />
          </div>
          <div>
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              required
              disabled={loading}
            />
          </div>
          <button className="button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="text-center mt-lg">
          <p className="text-secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
