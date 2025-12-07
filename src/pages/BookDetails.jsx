import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await apiFetch(`/books/${id}`);
        setBook(d);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (!book) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>{book.title}</h2>
        <div style={{ fontSize: 13 }}>{book.author}</div>
        <div style={{ marginTop: 12 }}>{book.description}</div>
      </div>
    </div>
  );
}
