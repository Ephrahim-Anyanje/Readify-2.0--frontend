const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
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
  if (!opts.body && !(opts.method && opts.method.toUpperCase() === "GET")) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (res.status === 401) throw new Error("Unauthorized");
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
