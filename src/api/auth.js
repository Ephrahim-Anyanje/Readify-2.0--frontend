import { apiRequest } from "./api";

export const signup = (username, password, email = null, full_name = null) =>
  apiRequest("/users", "POST", { username, password, email, full_name });

export const login = (username, password) =>
  apiRequest("/auth/token", "POST", { username, password });

export const getMe = (token) => apiRequest("/users/me", "GET", null, token);
