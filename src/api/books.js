import { apiRequest } from "./api";

export const getBooks = (token) => apiRequest("/books", "GET", null, token);

export const searchBooks = (query, maxResults = 8) =>
  apiRequest(`/books/search?q=${encodeURIComponent(query)}&max_results=${maxResults}`, "GET");

export const addBook = (book, token) =>
  apiRequest("/books", "POST", book, token);

export const getBookById = (id, token) =>
  apiRequest(`/books/${id}`, "GET", null, token);

export const getMyBooks = (username, token) =>
  apiRequest(`/books/my-books?username=${encodeURIComponent(username)}`, "GET", null, token);
