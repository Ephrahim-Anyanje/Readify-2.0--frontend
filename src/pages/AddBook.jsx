import React, { useState } from "react";
import { apiFetch } from "../api";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/books", {
        method: "POST",
        body: JSON.stringify({ title, author, description: desc }),
      });
      setMsg("Book added");
      setTitle("");
      setAuthor("");
      setDesc("");
    } catch (e) {
      setMsg("Failed to add");
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 640, margin: "24px auto" }} className="card">
        <h2>Add book</h2>
        {msg && <div>{msg}</div>}
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className="button">Add</button>
        </form>
      </div>
    </div>
  );
}
