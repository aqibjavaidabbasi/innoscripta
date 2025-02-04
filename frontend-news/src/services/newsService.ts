import axios from 'axios';
import { APP_API_BASE, APP_API_KEY } from "../config/config";

const API_KEY = APP_API_KEY;
const BASE_URL = APP_API_BASE;


export const fetchNews = async (): Promise<any[]> => {
   try {
      const response = await axios.get(
         `${BASE_URL}/everything?q=tesla&from=2025-01-03&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      return response.data.articles;
   } catch (error) {
      console.error('Error fetching news:', error);
      return [];
   }
};
