import { apiRequest } from "./api";

export const getActivity = (token) =>
  apiRequest("/activity", "GET", null, token);
