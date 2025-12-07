import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [full, setFull] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, full_name: full }),
        }
      );
      if (!res.ok) throw new Error("Signup failed");
      setMsg("Account created. Please log in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 460, margin: "28px auto" }} className="card">
        <h2>Sign up</h2>
        {msg && <div>{msg}</div>}
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            value={full}
            onChange={(e) => setFull(e.target.value)}
            placeholder="Full name"
          />
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
          <button className="button">Create account</button>
        </form>
      </div>
    </div>
  );
}
