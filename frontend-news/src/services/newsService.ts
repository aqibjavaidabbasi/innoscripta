import axios, { AxiosError } from "axios";
import { APP_BASE_URL } from "../config/config";
import { getAuthToken } from "./authService";

const api = axios.create({
   baseURL: APP_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Automatically attach Bearer token to protected API calls
api.interceptors.request.use(
   (config) => {
      const token = getAuthToken();
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// Fetch general news articles (requires authentication)
export const fetchNewsArticles = async (filters?: { keyword?: string; category?: string; source?: string; start_date?: string; end_date?: string }) => {
   try {
      const response = await api.get("/articles", { params: { ...filters } });
      return response.data;
   } catch (error) {
      if (error instanceof AxiosError) {
         console.error("Error fetching news articles:", error.message);
         throw new Error(error.response?.data?.message || "Failed to fetch news articles");
      }
      console.error("Unknown error:", error);
      throw new Error("An unknown error occurred");
   }
};

// Fetch available categories
export const fetchCategories = async () => {
   try {
      const response = await api.get("/filters/categories");
      return response.data;
   } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
   }
};

// Fetch available sources
export const fetchSources = async () => {
   try {
      const response = await api.get("/filters/sources");
      return response.data;
   } catch (error) {
      console.error("Error fetching sources:", error);
      throw new Error("Failed to fetch sources");
   }
};

// Fetch available authors
export const fetchAuthors = async () => {
   try {
      const response = await api.get("/filters/authors");
      return response.data;
   } catch (error) {
      console.error("Error fetching authors:", error);
      throw new Error("Failed to fetch authors");
   }
};

// Fetch personalized news feed (based on user preferences)
export const fetchPersonalizedNews = async () => {
   try {
      const response = await api.get("/personalized-feed");
      return response?.data;
   } catch (error) {
      console.error("Error fetching personalized news:", error);
      throw new Error("Failed to fetch personalized news feed");
   }
};

//  Set user preferences
export const setUserPreferences = async (preferences: { preferred_sources: string[]; preferred_categories: string[]; preferred_authors: string[] }) => {
   try {
      const response = await api.post("/user/preferences", preferences);
      return response.data?.data;
   } catch (error) {
      console.error("Error setting user preferences:", error);
      throw new Error("Failed to update user preferences");
   }
};

// Get user preferences
export const getUserPreferences = async () => {
   try {
      const response = await api.get("/user/preferences");
      return response?.data.data
   } catch (error) {
      console.error("Error fetching user preferences:", error);
      throw new Error("Failed to fetch user preferences");
   }
};
