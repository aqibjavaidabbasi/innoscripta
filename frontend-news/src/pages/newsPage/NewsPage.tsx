import React, { useEffect, useState } from "react";
import {
   fetchAuthors,
   fetchCategories,
   fetchNewsArticles,
   fetchSources,
} from "../../services/newsService";
import NewsCard from "../../components/newsCard/NewsCard";
import MultiSelectDropdown from "../../components/selector/MultiSelectDropdown";

interface ApiNewsArticle {
   id: number;
   title: string;
   description: string | null;
   url: string;
   image?: string;
   source: string;
   author?: string;
   category?: string;
   published_at: string;
}

interface NewsArticle {
   id: number;
   title: string;
   description: string | null;
   url: string;
   image?: string;
   source: string;
   author?: string;
   category?: string;
   publishedAt: string;
}

const NewsPage: React.FC = () => {
   const [news, setNews] = useState<NewsArticle[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [categories, setCategories] = useState<string[]>([]);
   const [sources, setSources] = useState<string[]>([]);
   const [authors, setAuthors] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1); // Added pagination state
   const [totalPages, setTotalPages] = useState(1); // Added total pages state

   // Selected Filters
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedSources, setSelectedSources] = useState<string[]>([]);
   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
   const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
   const [searchTerm, setSearchTerm] = useState<string>("");

   useEffect(() => {
      const loadFilters = async () => {
         try {
            const [categories, sources, authors] = await Promise.all([
               fetchCategories(),
               fetchSources(),
               fetchAuthors(),
            ]);

            setCategories(categories?.categories);
            setSources(sources?.sources);
            setAuthors(authors?.authors);
         } catch (error) {
            console.error("Error fetching filters:", error);
         }
      };

      loadFilters();
   }, []);

   useEffect(() => {
      const loadNews = async () => {
         try {
            const filters = {
               keyword: searchKeywords.join(","),
               category: selectedCategories.join(","),
               source: selectedSources.join(","),
               author: selectedAuthors.join(","),
               page: currentPage, // Include the current page
            };

            const data: { data: ApiNewsArticle[], last_page: number } = await fetchNewsArticles(filters);

            setNews(
               data.data.map((article: ApiNewsArticle) => ({
                  id: article.id,
                  title: article.title,
                  description: article.description,
                  url: article.url,
                  image: article.image,
                  source: article.source,
                  author: article.author,
                  category: article.category,
                  publishedAt: article.published_at,
               }))
            );
            setTotalPages(data.last_page); // Set total pages from the API response
         } catch (error) {
            console.error("Error fetching news:", error);
         } finally {
            setLoading(false);
         }
      };

      loadNews();
   }, [selectedCategories, selectedSources, selectedAuthors, searchKeywords, currentPage]); // Trigger on filter or page change

   if (loading) return <p>Loading news...</p>;

   const addFilter = (value: string, filterArray: string[], setFilterArray: React.Dispatch<React.SetStateAction<string[]>>) => {
      if (value && !filterArray.includes(value)) {
         setFilterArray([...filterArray, value]);
         resetFilters();
      }
   };

   const removeFilter = (value: string, setFilterArray: React.Dispatch<React.SetStateAction<string[]>>) => {
      setFilterArray((prevFilters) => prevFilters.filter((filter) => filter !== value));
   };

   const resetFilters = () => {
      setSearchTerm("");
      document.querySelectorAll("select").forEach((select) => (select.value = ""));
   };

   const addSearchKeyword = () => {
      if (searchTerm.trim() !== "" && !searchKeywords.includes(searchTerm.trim())) {
         setSearchKeywords([...searchKeywords, searchTerm.trim()]);
         resetFilters();
      }
   };

   const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
         setCurrentPage(page);
      }
   };

   return (
      <div className="p-4">
         <h1 className="mb-4 text-2xl font-bold">Latest News</h1>
         <div className="flex flex-wrap gap-2 mb-4">
            {[...selectedCategories, ...selectedSources, ...selectedAuthors, ...searchKeywords].map((filter, index) => (
               <div key={index} className="flex items-center px-3 py-1 bg-gray-200 rounded-full">
                  {filter}
                  <button onClick={() => {
                     removeFilter(filter, setSelectedCategories);
                     removeFilter(filter, setSelectedSources);
                     removeFilter(filter, setSelectedAuthors);
                     removeFilter(filter, setSearchKeywords);
                  }} className="ml-2 text-red-500">×</button>
               </div>
            ))}
         </div>
         <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            <MultiSelectDropdown
               options={categories}
               selectedOptions={selectedCategories}
               setSelectedOptions={setSelectedCategories}
            />
            <MultiSelectDropdown
               options={sources}
               selectedOptions={selectedSources}
               setSelectedOptions={setSelectedSources}
            />
            <MultiSelectDropdown
               options={authors}
               selectedOptions={selectedAuthors}
               setSelectedOptions={setSelectedAuthors}
            />

            <div className="flex space-x-4">
               <input type="text" placeholder="Search" className="w-full p-2 border border-gray-300 " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               <button onClick={addSearchKeyword} className="px-2 text-white bg-blue-500 ">
                  Search
               </button>
            </div>
         </div>
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {news.length > 0 ? news.map((article, index) => <NewsCard key={index} article={article} />) : <p className="text-gray-500">No news found matching the filters.</p>}
         </div>   
         <div className="flex justify-between mt-6">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 bg-gray-200 rounded-lg">
               &laquo; Previous
            </button>
            <div>
               Page {currentPage} of {totalPages}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 bg-gray-200 rounded-lg">
               Next &raquo;
            </button>
         </div>
      </div>
   );
};

export default NewsPage;
