// src/services/api/index.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://209.38.231.125:4000", // your backend droplet IP + port
  headers: {
    "Content-Type": "application/json",
  },
});

// Example requests
export const signup = (data: any) => api.post("/api/auth/signup", data);
export const signin = (data: any) => api.post("/api/auth/signin", data);

export default api;
