import axios from "axios";
import { useAuthStore } from "@/store/auth";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.44:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// get token without using React hook
const getToken = () => useAuthStore.getState().token;
console.log("API_BASE_URI:", API_BASE_URL)
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log("User Token:", token)
    } else {
      console.warn("⚠️ No token in auth store");
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
