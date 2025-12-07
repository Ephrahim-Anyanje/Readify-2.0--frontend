import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await apiFetch("/activity/recent");
        setActivity(Array.isArray(d) ? d : []);
      } catch (e) {
        console.error("Failed to load recent activity:", e);
        setActivity([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      "wishlist": "var(--gray-500)",
      "reading": "var(--primary)",
      "completed": "var(--success)",
      "on-hold": "var(--warning)",
      "dropped": "var(--error)",
    };
    return colors[status] || "var(--gray-500)";
  };

  const getStatusLabel = (status) => {
    const labels = {
      "wishlist": "Wishlist",
      "reading": "Reading",
      "completed": "Completed",
      "on-hold": "On Hold",
      "dropped": "Dropped",
    };
    return labels[status] || status;
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-xl">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/books/add" className="button">
          + Add Book
        </Link>
      </div>

      <section className="mt-xl">
        <div className="flex items-center justify-between mb-lg">
          <h3>Recent Activity</h3>
          <Link to="/activity" className="button-ghost button-sm">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="card text-center">
            <div className="loading" style={{ margin: "2rem auto" }}></div>
            <p className="text-secondary">Loading activity...</p>
          </div>
        ) : activity.length === 0 ? (
          <div className="card text-center" style={{ padding: "3rem 2rem" }}>
            <h4>No recent activity</h4>
            <p className="text-secondary">Start by adding a book to your library!</p>
            <Link to="/books/add" className="button mt-md">
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-auto">
            {activity.map((a) => (
              <Link
                key={a.id}
                to={`/books/${a.book?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="book-card card-interactive">
                  {a.book?.cover_image ? (
                    <img
                      src={a.book.cover_image}
                      alt={a.book.title}
                      className="book-cover"
                      style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }}
                    />
                  ) : (
                    <div className="book-cover">
                      {a.book?.title?.charAt(0) || "B"}
                    </div>
                  )}
                  <div className="book-info">
                    <div className="flex items-center justify-between mb-sm">
                      <h3 className="book-title" style={{ margin: 0, flex: 1 }}>
                        {a.book?.title || "Unknown Book"}
                      </h3>
                      {a.is_favorite && (
                        <span style={{ fontSize: "1.5rem", color: "var(--warning)", marginLeft: "0.5rem" }}>★</span>
                      )}
                    </div>
                    {a.book?.author && (
                      <div className="book-author">by {a.book.author}</div>
                    )}
                    
                    <div className="mt-md">
                      <div className="flex items-center justify-between mb-sm">
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: getStatusColor(a.status),
                            color: "white",
                            textTransform: "capitalize",
                          }}
                        >
                          {getStatusLabel(a.status)}
                        </span>
                        {a.progress !== null && a.progress !== undefined && (
                          <span className="text-secondary" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                            {a.progress}%
                          </span>
                        )}
                      </div>
                      
                      {a.progress !== null && a.progress !== undefined && (
                        <div
                          style={{
                            width: "100%",
                            height: "8px",
                            background: "var(--bg-tertiary)",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                            marginTop: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              width: `${a.progress}%`,
                              height: "100%",
                              background: `linear-gradient(90deg, ${getStatusColor(a.status)}, ${getStatusColor(a.status)}dd)`,
                              borderRadius: "var(--radius-md)",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {a.book?.category && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <span className="book-category">{a.book.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
