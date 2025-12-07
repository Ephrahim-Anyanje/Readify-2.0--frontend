import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../App";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [full, setFull] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setFull(user.full_name);
    }
  }, [user]);

  const save = async () => {
    if (!user) return;
    
    setLoading(true);
    setMsg(null);
    try {
      await apiFetch(`/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ full_name: full }),
      });
      setMsg("Profile updated successfully!");
      
      // Update local user state
      const updated = { ...user, full_name: full };
      setUser(updated);
      
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setMsg("Failed to update profile: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 className="mb-lg">Profile</h1>
        <div className="card">
          <h3 className="mb-lg">Account Information</h3>
          
          {msg && (
            <div className={msg.includes("success") ? "alert alert-success mb-lg" : "alert alert-error mb-lg"}>
              {msg}
            </div>
          )}

          <div className="flex flex-col gap-md">
            <div>
              <label>Username</label>
              <input
                value={user?.username || ""}
                disabled
                style={{ background: "var(--bg-tertiary)", cursor: "not-allowed" }}
              />
              <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Username cannot be changed
              </p>
            </div>

            <div>
              <label>Email</label>
              <input
                value={user?.email || ""}
                disabled
                style={{ background: "var(--bg-tertiary)", cursor: "not-allowed" }}
              />
              <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Email cannot be changed
              </p>
            </div>

            <div>
              <label>Full Name</label>
              <input
                value={full}
                onChange={(e) => setFull(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="flex gap-md mt-md">
              <button onClick={save} className="button" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
