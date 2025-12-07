import { apiRequest } from "./api";

export const getActivity = (token) =>
  apiRequest("/activity", "GET", null, token);

export const getUserActivity = (username, token) =>
  apiRequest(`/activity/${username}`, "GET", null, token);

export const getBookActivity = (bookId, username, token) =>
  apiRequest(`/activity/book/${bookId}/user/${username}`, "GET", null, token);

export const updateActivity = (activityId, updates, token) =>
  apiRequest(`/activity/${activityId}`, "PUT", updates, token);
