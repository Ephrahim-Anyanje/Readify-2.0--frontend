import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { getUserActivity } from "../api/activity";
import { getToken } from "../api";
import { useAuth } from "../App";
import BookEditModal from "../components/BookEditModal";

export default function Activity() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, reading, completed, wishlist

  useEffect(() => {
    if (!user?.username) {
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        const { ok, data } = await getUserActivity(user.username, getToken());
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load activity:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleBookClick = (e, activity) => {
    e.preventDefault();
    setSelectedBook(activity);
    setShowModal(true);
  };

  const handleUpdate = (updatedActivity) => {
    if (updatedActivity === null) {
      // Book was deleted
      setItems(items.filter(a => a.id !== selectedBook.id));
    } else {
      setItems(items.map(a => 
        a.id === updatedActivity.id ? updatedActivity : a
      ));
    }
    setShowModal(false);
    setSelectedBook(null);
  };

  const filteredItems = filter === "all" 
    ? items 
    : items.filter(item => item.status === filter);

  const stats = {
    total: items.length,
    reading: items.filter(i => i.status === "reading").length,
    completed: items.filter(i => i.status === "completed").length,
    wishlist: items.filter(i => i.status === "wishlist").length,
    favorites: items.filter(i => i.is_favorite).length,
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <div className="loading" style={{ margin: "0 auto 1rem" }}></div>
          <p className="text-secondary">Loading your activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-xl">
        <h1>Reading Activity</h1>
        <p className="text-secondary">Track your reading progress and manage your books</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 mb-xl" style={{ gap: "1rem" }}>
        <div className="card card-compact text-center">
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>
            {stats.total}
          </div>
          <div className="text-secondary" style={{ fontSize: "0.875rem" }}>Total Books</div>
        </div>
        <div className="card card-compact text-center">
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--success)" }}>
            {stats.reading}
          </div>
          <div className="text-secondary" style={{ fontSize: "0.875rem" }}>Reading</div>
        </div>
        <div className="card card-compact text-center">
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary-dark)" }}>
            {stats.completed}
          </div>
          <div className="text-secondary" style={{ fontSize: "0.875rem" }}>Completed</div>
        </div>
        <div className="card card-compact text-center">
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--warning)" }}>
            {stats.favorites}
          </div>
          <div className="text-secondary" style={{ fontSize: "0.875rem" }}>Favorites</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-sm mb-lg" style={{ flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "button button-sm" : "button-ghost button-sm"}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter("reading")}
          className={filter === "reading" ? "button button-sm" : "button-ghost button-sm"}
        >
          Reading ({stats.reading})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "button button-sm" : "button-ghost button-sm"}
        >
          Completed ({stats.completed})
        </button>
        <button
          onClick={() => setFilter("wishlist")}
          className={filter === "wishlist" ? "button button-sm" : "button-ghost button-sm"}
        >
          Wishlist ({stats.wishlist})
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <h3>No {filter === "all" ? "" : filter} books found</h3>
          <p className="text-secondary mb-lg">
            {filter === "all" 
              ? "Start tracking your reading by adding books to your library!"
              : `You don't have any books with status "${filter}" yet.`}
          </p>
          <Link to="/books/add" className="button">
            Add Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-auto">
          {filteredItems.map((it) => (
            <div
              key={it.id}
              className="card card-interactive"
              onClick={(e) => handleBookClick(e, it)}
              style={{ cursor: "pointer" }}
            >
              {it.book?.cover_image ? (
                <img
                  src={it.book.cover_image}
                  alt={it.book.title}
                  className="book-cover"
                  style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0", marginBottom: "1rem" }}
                />
              ) : (
                <div className="book-cover" style={{ marginBottom: "1rem" }}>
                  {it.book?.title?.charAt(0) || "B"}
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-sm">
                  <h3 className="book-title" style={{ margin: 0, flex: 1 }}>
                    {it.book?.title || "Unknown Book"}
                  </h3>
                  {it.is_favorite && (
                    <span style={{ fontSize: "1.5rem", color: "var(--warning)" }}>★</span>
                  )}
                </div>
                {it.book?.author && (
                  <div className="book-author">by {it.book.author}</div>
                )}
                <div className="flex items-center gap-md mt-md" style={{ flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      background: "var(--primary-light)",
                      color: "white",
                    }}
                  >
                    {it.status}
                  </span>
                  {it.progress !== null && it.progress !== undefined && (
                    <span className="text-secondary">
                      {it.progress}% complete
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedBook && (
        <BookEditModal
          activity={selectedBook}
          user={user}
          onClose={() => {
            setShowModal(false);
            setSelectedBook(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
