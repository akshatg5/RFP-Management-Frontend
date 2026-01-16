import axios from "axios";
import { BASE_API_URL } from "@/config/api";

export const apiClient = axios.create({
  baseURL: BASE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const whoami = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return { authenticated: false };
  }

  try {
    const response = await apiClient.get("/api/auth/whoami", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};
