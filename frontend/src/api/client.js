import axios from "axios";

// Base URL comes from env so the app works in dev and production without edits.
// Set VITE_API_URL in a .env file (see .env.example).
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({ baseURL, timeout: 60_000 });

export const TOKEN_KEY = "mediscan:token";

/** Attach the stored JWT to every request. */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Extracts a user-friendly message from an axios error, preferring the API's. */
export const getErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (err?.message === "Network Error")
    return "Can't reach the server. Make sure the backend is running.";
  return "Something went wrong. Please try again.";
};

// --- Auth ------------------------------------------------------------------

export const registerRequest = async ({ name, email, password }) => {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data; // { token, user }
};

export const loginRequest = async ({ email, password }) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data; // { token, user }
};

export const fetchMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data.user;
};

// --- Reports ---------------------------------------------------------------

/**
 * Sends a report (image File or pasted text) to the backend and returns the
 * parsed report object.
 */
export const analyzeReport = async ({ file, text }) => {
  let data, config;
  if (file) {
    data = new FormData();
    data.append("reportImage", file);
    config = { headers: { "Content-Type": "multipart/form-data" } };
  } else {
    data = { text };
    config = { headers: { "Content-Type": "application/json" } };
  }
  const res = await api.post("/api/reports/simplify", data, config);
  return res.data.report;
};

export default api;
