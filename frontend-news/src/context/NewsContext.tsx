import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fetchNews } from "../services/newsService";

interface NewsArticle {
   urlToImage?: string;
   title: string;
   description: string;
   url: string;
   source: { name: string };
   category: string;
   publishedAt: string;
}

interface FilterQuery {
   keyword: string;
   category: string;
   source: string;
   start_date: string;
   end_date: string;
}

interface NewsContextType {
   news: NewsArticle[];
   filterQuery: FilterQuery;
   setFilterQuery: (query: FilterQuery) => void;
}

const NewsContext = createContext<NewsContextType>({
   news: [],
   filterQuery: {
      keyword: "",
      category: "",
      source: "",
      start_date: "",
      end_date: "",
   },
   setFilterQuery: () => { },
});

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [news, setNews] = useState<NewsArticle[]>([]);
   const [filterQuery, setFilterQuery] = useState<FilterQuery>({
      keyword: "",
      category: "",
      source: "",
      start_date: "",
      end_date: "",
   });

   useEffect(() => {
      const getNews = async () => {
         const data = await fetchNews();
         setNews(data);
      };
      getNews();
   }, []);

   return (
      <NewsContext.Provider value={{ news, filterQuery, setFilterQuery }}>
         {children}
      </NewsContext.Provider>
   );
};

export default NewsContext;
