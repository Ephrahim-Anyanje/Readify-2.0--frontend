import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../api";
import { getUserActivity } from "../api/activity";
import { useAuth } from "../App";
import BookEditModal from "../components/BookEditModal";

export default function Library() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const { ok, data } = await getUserActivity(user.username, getToken());
        if (ok && Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      } catch (e) {
        console.error("Failed to load library:", e);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  const handleBookClick = (e, activity) => {
    e.preventDefault();
    setSelectedBook(activity);
    setShowModal(true);
  };

  const handleUpdate = (updatedActivity) => {
    setActivities(activities.map(a => 
      a.id === updatedActivity.id ? updatedActivity : a
    ));
    setShowModal(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">
          <div className="loading" style={{ margin: "2rem auto" }}></div>
          <p className="text-secondary">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-xl">
        <div>
          <h1>My Library</h1>
          <p className="text-secondary">
            {activities.length} {activities.length === 1 ? 'book' : 'books'} in your collection
          </p>
        </div>
        <Link to="/books/add" className="button">
          + Add Book
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <h3>Your library is empty</h3>
          <p className="text-secondary mb-lg">Start building your reading collection by adding your first book!</p>
          <Link to="/books/add" className="button">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="book-card card-interactive"
              onClick={(e) => handleBookClick(e, activity)}
              style={{ cursor: "pointer" }}
            >
              {activity.book?.cover_image ? (
                <img
                  src={activity.book.cover_image}
                  alt={activity.book.title}
                  className="book-cover"
                  style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }}
                />
              ) : (
                <div className="book-cover">
                  {activity.book?.title?.charAt(0) || "B"}
                </div>
              )}
              <div className="book-info">
                <div className="flex items-center justify-between mb-sm">
                  <h3 className="book-title" style={{ margin: 0, flex: 1 }}>
                    {activity.book?.title}
                  </h3>
                  {activity.is_favorite && (
                    <span style={{ fontSize: "1.5rem", color: "var(--warning)" }}>★</span>
                  )}
                </div>
                {activity.book?.author && (
                  <div className="book-author">by {activity.book.author}</div>
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
                    {activity.status}
                  </span>
                  {activity.progress !== null && activity.progress !== undefined && (
                    <span className="text-secondary">
                      {activity.progress}%
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
