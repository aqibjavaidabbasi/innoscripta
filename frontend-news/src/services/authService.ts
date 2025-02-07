import axios, { AxiosError } from "axios";
import { APP_BASE_URL } from "../config/config";

// Create an Axios instance
const api = axios.create({
   baseURL: APP_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// User Authentication Services
export const registerUser = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
   try {
      const response = await api.post("/register", data);
      return response.data;
   } catch (error) {
      if (error instanceof AxiosError) {
         throw new Error(error.response?.data?.message || "Registration failed");
      }
      throw new Error("An unknown error occurred");
   }
};

export const loginUser = async (data: { email: string; password: string }) => {
   try {
      const response = await api.post("/login", data);
      return response.data;
   } catch (error) {
      if (error instanceof AxiosError) {
         throw new Error(error.response?.data?.message || "Invalid email or password");
      }
      throw new Error("An unknown error occurred");
   }
};

// Authentication Token Management

export const saveAuthToken = (token: string) => {
   localStorage.setItem("authToken", token);

};

export const saveUserData = (data: { id: number; name: string; email: string }) => {
   localStorage.setItem("userData", JSON.stringify(data));
};

export const getAuthToken = () => {
   return localStorage.getItem("authToken");
};

export const removeAuthToken = () => {
   localStorage.removeItem("authToken");
};
