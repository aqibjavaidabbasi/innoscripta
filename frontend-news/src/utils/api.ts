import axios from "axios";
import { APP_BASE_URL } from "../config/config";
import { getAuthToken, removeAuthToken } from "../services/authService";

const api = axios.create({
   baseURL: APP_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

api.interceptors.request.use(
   (config) => {
      if (!config.url?.includes("/login") && !config.url?.includes("/register")) {
         const token = getAuthToken();
         if (token) {
            config.headers.Authorization = `Bearer ${token}`;
         }
      }
      return config;
   },
   (error) => Promise.reject(error)
);

api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         removeAuthToken();
         window.location.href = "/login";
      }
      return Promise.reject(error);
   }
);

export default api;