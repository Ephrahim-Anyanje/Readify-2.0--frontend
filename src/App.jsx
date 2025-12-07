import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import AddBook from "./pages/AddBook";
import BookDetails from "./pages/BookDetails";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import { apiFetch, getToken, removeToken } from "./api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const mockUser = {
          username: token.split("_")[2] || "user",
          id: parseInt(token.split("_")[1]) || 1,
        };
        setUser(mockUser);
      } catch (e) {
        console.error("Auth check failed:", e);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginRefresh = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Parse token to get user info (temporary solution)
      const parts = token.split("_");
      const mockUser = {
        username: parts[2] || "user",
        id: parseInt(parts[1]) || 1,
      };
      setUser(mockUser);
    } catch (e) {
      console.error("Login refresh failed:", e);
      removeToken();
      setUser(null);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <div>
        <NavBar />
        <main
          style={{ maxWidth: 1100, margin: "20px auto", padding: "0 16px" }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login onLogin={loginRefresh} />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/library"
              element={user ? <Library /> : <Navigate to="/login" />}
            />
            <Route
              path="/books/add"
              element={user ? <AddBook /> : <Navigate to="/login" />}
            />
            <Route
              path="/books/:id"
              element={user ? <BookDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/activity"
              element={user ? <Activity /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="*"
              element={<div className="container">404 - Page not found</div>}
            />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
