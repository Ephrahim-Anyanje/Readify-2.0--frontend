import React, { useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../App";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [full, setFull] = useState(user?.full_name || "");
  const [msg, setMsg] = useState(null);

  const save = async () => {
    try {
      await apiFetch(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ full_name: full }),
      });
      setMsg("Saved");
      // refresh local user
      const updated = await apiFetch("/users/me");
      setUser(updated);
    } catch (e) {
      setMsg("Failed");
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 480, margin: "24px auto" }} className="card">
        <h2>Profile</h2>
        <div style={{ marginTop: 8 }}>
          <label>Full name</label>
          <input value={full} onChange={(e) => setFull(e.target.value)} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={save} className="button">
            Save
          </button>
          {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}
