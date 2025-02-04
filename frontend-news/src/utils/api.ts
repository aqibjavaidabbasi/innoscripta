import axios, { AxiosError } from 'axios';
import { APP_BASE_URL } from "../config/config";


const api = axios.create({
   baseURL: APP_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

export const registerUser = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
   try {
      const response = await api.post('/register', data);
      return response.data;
   } catch (error) {
      if (error instanceof AxiosError) {
         throw new Error(error.response?.data?.message || 'An error occurred');
      }
      throw new Error('An unknown error occurred');
   }
};

export const loginUser = async (data: { email: string; password: string }) => {
   try {
      const response = await api.post('/login', data);
      return response.data;
   } catch (error) {
      if (error instanceof AxiosError) {
         throw new Error(error.response?.data?.message || 'Invalid email or password');
      }
      throw new Error('An unknown error occurred');
   }
};

export const saveAuthToken = (token: string) => {
   localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
   return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
   localStorage.removeItem('authToken');
};