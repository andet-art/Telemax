import axios from "axios";

const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});
