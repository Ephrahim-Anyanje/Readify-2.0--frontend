import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const d = await apiFetch("/activity/recent");
        setActivity(d || []);
      } catch (e) {}
    })();
  }, []);

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
        <div>
          <Link to="/books/add" className="button">
            Add Book
          </Link>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Recent activity</h3>
        <div style={{ marginTop: 8 }}>
          {activity.length === 0 ? (
            <div className="card">No recent activity</div>
          ) : (
            activity.map((a, i) => (
              <div key={i} className="card" style={{ marginTop: 8 }}>
                {a.description || JSON.stringify(a)}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
