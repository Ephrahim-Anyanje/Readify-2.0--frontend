import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Activity() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const d = await apiFetch("/activity");
        setItems(d || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Activity</h2>
      <div style={{ marginTop: 12 }}>
        {items.map((it, i) => (
          <div key={i} className="card" style={{ marginTop: 8 }}>
            {it.description || JSON.stringify(it)}
          </div>
        ))}
      </div>
    </div>
  );
}
