import { apiRequest } from "./api";

export const signup = (username, password) =>
  apiRequest("/auth/signup", "POST", { username, password });

export const login = (username, password) =>
  apiRequest("/auth/login", "POST", { username, password });

export const getMe = (token) => apiRequest("/users/me", "GET", null, token);
