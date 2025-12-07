const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "readify_token";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, opts = {}) {
  const headers = opts.headers ? { ...opts.headers } : {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (opts.body || (opts.method && opts.method.toUpperCase() !== "GET")) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  
  try {
    const res = await fetch(API_BASE + path, { ...opts, headers });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    
    if (!res.ok) {
      const error = new Error(data?.detail || data?.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    if (error.status === 401) {
      throw new Error("Unauthorized");
    }
    throw error;
  }
}
