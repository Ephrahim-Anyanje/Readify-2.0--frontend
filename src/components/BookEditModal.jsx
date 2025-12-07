import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { updateActivity } from "../api/activity";
import { getToken } from "../api";

export default function BookEditModal({ activity, user, onClose, onUpdate }) {
  const [status, setStatus] = useState(activity.status || "wishlist");
  const [progress, setProgress] = useState(activity.progress || 0);
  const [isFavorite, setIsFavorite] = useState(activity.is_favorite || false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const statusOptions = [
    { value: "wishlist", label: "Wishlist" },
    { value: "reading", label: "Currently Reading" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
    { value: "dropped", label: "Dropped" },
  ];

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const updates = {
        status,
        progress: parseInt(progress) || 0,
        is_favorite: isFavorite,
      };

      const { ok, data } = await updateActivity(activity.id, updates, getToken());

      if (!ok) {
        throw new Error(data?.detail || "Failed to update book");
      }

      setMessage("Book updated successfully!");
      setTimeout(() => {
        onUpdate(data);
      }, 500);
    } catch (e) {
      setMessage("Failed to update: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this book from your library?")) {
      return;
    }

    setLoading(true);
    try {
      // Note: You may need to add a DELETE endpoint for activities
      await apiFetch(`/activity/${activity.id}`, {
        method: "DELETE",
      });
      onUpdate(null); // Signal deletion
    } catch (e) {
      setMessage("Failed to remove book: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-lg">
          <h2>Edit Book</h2>
          <button
            onClick={onClose}
            className="button-ghost button-sm"
            style={{ minWidth: "auto", padding: "0.5rem" }}
            title="Close"
          >
            Close
          </button>
        </div>

        {activity.book?.cover_image && (
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <img
              src={activity.book.cover_image}
              alt={activity.book.title}
              style={{
                maxWidth: "200px",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{activity.book?.title}</h3>
          {activity.book?.author && (
            <p className="text-secondary">by {activity.book.author}</p>
          )}
        </div>

        {message && (
          <div
            className={message.includes("success") ? "alert alert-success" : "alert alert-error"}
            style={{ marginBottom: "1.5rem" }}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-md">
          <div>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="0-100"
              disabled={loading}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                disabled={loading}
                style={{ width: "auto", cursor: "pointer" }}
              />
              <span>Mark as Favorite</span>
            </label>
          </div>

          <div className="flex gap-md mt-md">
            <button
              onClick={handleSave}
              className="button"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onClose}
              className="button button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginTop: "1rem" }}>
            <button
              onClick={handleDelete}
              className="button button-outline"
              disabled={loading}
              style={{ width: "100%", color: "var(--error)", borderColor: "var(--error)" }}
            >
              Remove from Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

