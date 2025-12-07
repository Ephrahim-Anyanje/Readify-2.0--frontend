import { apiRequest } from "./api";

export const getBooks = (token) => apiRequest("/books", "GET", null, token);

export const addBook = (book, token) =>
  apiRequest("/books", "POST", book, token);

export const getBookById = (id, token) =>
  apiRequest(`/books/${id}`, "GET", null, token);
