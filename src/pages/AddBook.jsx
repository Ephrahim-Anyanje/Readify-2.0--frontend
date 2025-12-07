import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getToken } from "../api";
import { searchBooks, addBook } from "../api/books";
import { useAuth } from "../App";

export default function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setMsg(null);
    setSearchResults([]);
    try {
      const { ok, status, data } = await searchBooks(searchQuery, 12);
      console.log("Search response:", { ok, status, data });
      
      if (!ok) {
        throw new Error(data?.detail || `Search failed with status ${status}`);
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
        setMsg(null);
      } else if (Array.isArray(data) && data.length === 0) {
        setMsg("No books found. Try a different search term.");
        setSearchResults([]);
      } else {
        console.error("Unexpected data format:", data);
        setMsg("Unexpected response format. Please try again.");
        setSearchResults([]);
      }
    } catch (e) {
      console.error("Search error:", e);
      setMsg(`Search failed: ${e.message || "Please try again."}`);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddBook = async (bookData) => {
    if (!user) {
      setMsg("You must be logged in to add books");
      return;
    }

    setAdding(true);
    setMsg(null);
    try {
      console.log("Adding book:", bookData);
      
      // First, create or get the book
      const { ok: bookOk, status: bookStatus, data: bookData_result } = await addBook(bookData, getToken());
      
      console.log("Book creation response:", { ok: bookOk, status: bookStatus, data: bookData_result });
      
      if (!bookOk || !bookData_result) {
        const errorMsg = bookData_result?.detail || `Failed to create book (status: ${bookStatus})`;
        console.error("Book creation failed:", errorMsg);
        throw new Error(errorMsg);
      }

      const bookId = bookData_result.id;
      if (!bookId) {
        throw new Error("Book created but no ID returned");
      }

      console.log("Creating activity for book ID:", bookId, "Username:", user.username);

      // Then create an activity linking the user to the book
      try {
        const activityResult = await apiFetch("/activity/", {
          method: "POST",
          body: JSON.stringify({
            username: user.username,
            book_id: bookId,
            status: "wishlist",
            progress: 0,
          }),
        });

        console.log("Activity creation result:", activityResult);

        if (!activityResult || !activityResult.id) {
          throw new Error("Activity was not created successfully");
        }

        setMsg("Book added to your library!");
        setTimeout(() => {
          navigate("/library");
        }, 1500);
      } catch (activityError) {
        console.error("Activity creation error:", activityError);
        // Even if activity creation fails, the book was created
        // So we should still show success but warn about the issue
        throw new Error(`Book created but failed to add to library: ${activityError.message}`);
      }
    } catch (e) {
      console.error("Error adding book:", e);
      setMsg("Failed to add book: " + (e.message || "Unknown error"));
    } finally {
      setAdding(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMsg("Title is required");
      return;
    }
    await handleAddBook({ title, author: author || null, description: desc || null });
  };

  return (
    <div className="container">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 className="mb-lg">Add Book</h1>
        
        {msg && (
          <div className={msg.includes("added") || msg.includes("✅") ? "alert alert-success" : "alert alert-error"} style={{ marginBottom: "1.5rem" }}>
            {msg}
          </div>
        )}

        {!showManual ? (
          <div className="card">
            <h3 className="mb-lg">Search Google Books</h3>
            <form onSubmit={handleSearch} className="flex gap-md mb-lg">
              <input
                type="text"
                placeholder="Search for books (e.g., 'python', 'harry potter')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1 }}
                disabled={searching}
              />
              <button type="submit" className="button" disabled={searching || !searchQuery.trim()}>
                {searching ? "Searching..." : "Search"}
              </button>
            </form>
            
            {searching && (
              <div className="text-center p-lg text-secondary">
                <div className="loading" style={{ margin: "0 auto 1rem" }}></div>
                Searching Google Books... This may take a few seconds.
              </div>
            )}

            <div className="mt-md">
              <button
                onClick={() => setShowManual(true)}
                className="button-ghost button-sm"
              >
                Or add manually instead
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-xl">
                <h4 className="mb-lg">Search Results</h4>
                <div className="grid grid-auto">
                  {searchResults.map((book, idx) => (
                    <div
                      key={idx}
                      className="book-card"
                      style={{
                        opacity: adding ? 0.6 : 1,
                        cursor: adding ? "not-allowed" : "pointer",
                      }}
                    >
                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="book-cover"
                          style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }}
                        />
                      ) : (
                        <div className="book-cover">
                          {book.title?.charAt(0) || "B"}
                        </div>
                      )}
                      <div className="book-info">
                        <h4 className="book-title">{book.title}</h4>
                        {book.author && (
                          <div className="book-author">{book.author}</div>
                        )}
                        {book.description && (
                          <p className="book-description">{book.description}</p>
                        )}
                        <button
                          onClick={() => handleAddBook(book)}
                          className="button"
                          style={{ marginTop: "auto", width: "100%" }}
                          disabled={adding}
                        >
                          {adding ? "Adding..." : "Add to Library"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <h3 className="mb-lg">Add Book Manually</h3>
            <form
              onSubmit={handleManualSubmit}
              className="flex flex-col gap-md"
            >
              <div>
                <label>Title *</label>
                <input
                  placeholder="Enter book title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={adding}
                />
              </div>
              <div>
                <label>Author</label>
                <input
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={adding}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  placeholder="Enter book description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  disabled={adding}
                />
              </div>
              <div className="flex gap-md">
                <button type="submit" className="button" disabled={adding}>
                  {adding ? "Adding..." : "Add Book"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowManual(false);
                    setTitle("");
                    setAuthor("");
                    setDesc("");
                  }}
                  className="button button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
