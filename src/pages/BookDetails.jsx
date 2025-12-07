import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await apiFetch(`/books/${id}`);
        setBook(d);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <div className="loading" style={{ margin: "0 auto 1rem" }}></div>
          <p className="text-secondary">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <h3>Book Not Found</h3>
          <p className="text-secondary mb-lg">{error || "The book you're looking for doesn't exist."}</p>
          <Link to="/library" className="button">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/library" className="button-ghost button-sm mb-lg" style={{ display: "inline-flex", alignItems: "center" }}>
        ← Back to Library
      </Link>
      
      <div className="card">
        <div className="grid grid-2" style={{ gap: "2rem" }}>
          <div>
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-lg)",
                }}
              />
            ) : (
              <div
                className="book-cover"
                style={{
                  maxWidth: "400px",
                  borderRadius: "var(--radius-xl)",
                }}
              >
                {book.title?.charAt(0) || "B"}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="mb-md">{book.title}</h1>
            {book.author && (
              <div className="book-author mb-lg" style={{ fontSize: "1.125rem" }}>
                by {book.author}
              </div>
            )}
            
            {book.category && (
              <span className="book-category mb-lg" style={{ display: "inline-block" }}>
                {book.category}
              </span>
            )}
            
            {book.description && (
              <div className="mt-lg">
                <h4 className="mb-md">Description</h4>
                <p style={{ lineHeight: "1.8", color: "var(--text-secondary)" }}>
                  {book.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
