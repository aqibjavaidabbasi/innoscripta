import React, { useEffect, useState } from "react";
import {
   fetchAuthors,
   fetchCategories,
   fetchPersonalizedNews,
   fetchSources,
} from "../../services/newsService";
import PersonalizedNewsCard from "../../components/newsCard/PersonalizedNewsCard";
import MultiSelectDropdown from "../../components/selector/MultiSelectDropdown";

// Define the expected API response structure
interface ApiNewsArticle {
   id: number;
   title: string;
   description: string | null;
   url: string;
   image?: string;
   source: string;
   author?: string;
   category?: string;
   publishedAt: string; // Use 'publishedAt' here instead of 'published_at'
}
interface ApiResponse {
   current_page: number;
   data: ApiNewsArticle[];
   last_page: number;
   next_page_url: string | null;
   prev_page_url: string | null;
   total: number;
}

const PersonalizedNewsPage: React.FC = () => {
   const [news, setNews] = useState<ApiNewsArticle[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [categories, setCategories] = useState<string[]>([]);
   const [sources, setSources] = useState<string[]>([]);
   const [authors, setAuthors] = useState<string[]>([]);

   const [selectedCategory, setSelectedCategory] = useState<string>("");
   const [selectedSource, setSelectedSource] = useState<string>("");
   const [selectedAuthor, setSelectedAuthor] = useState<string>("");
   const [searchTerm, setSearchTerm] = useState<string>("");

   const [currentPage, setCurrentPage] = useState<number>(1);
   const [totalPages, setTotalPages] = useState<number>(1);

   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedSources, setSelectedSources] = useState<string[]>([]);
   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
   const [searchKeywords, setSearchKeywords] = useState<string[]>([]);

   useEffect(() => {
      const loadNews = async (page = 1) => {
         try {
            const categories = await fetchCategories();
            const sources = await fetchSources();
            const authors = await fetchAuthors();
            setCategories(categories?.categories);
            setSources(sources?.sources);
            setAuthors(authors?.authors);

            const response: ApiResponse = await fetchPersonalizedNews();
            setNews(response.data);
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
         } catch (error) {
            console.error("Error fetching news:", error);
         } finally {
            setLoading(false);
         }
      };

      loadNews(currentPage);
   }, [currentPage]);

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

   const filteredNews = news.filter((article) => {
      const matchesCategory = !selectedCategories.length || selectedCategories.includes(article.category || "");
      const matchesSource = !selectedSources.length || selectedSources.includes(article.source || "");
      const matchesAuthor = !selectedAuthors.length || selectedAuthors.includes(article.author || "");
      const matchesSearch = !searchKeywords.length || searchKeywords.some((keyword) =>
         article.title.toLowerCase().includes(keyword.toLowerCase()) ||
         (article.description && article.description.toLowerCase().includes(keyword.toLowerCase()))
      );
      return matchesCategory && matchesSource && matchesAuthor && matchesSearch;
   });

   const handlePagination = (direction: "next" | "prev") => {
      if (direction === "next" && currentPage < totalPages) {
         setCurrentPage(currentPage + 1);
      } else if (direction === "prev" && currentPage > 1) {
         setCurrentPage(currentPage - 1);
      }
   };

   return (
      <div className="p-4">
         <h1 className="mb-4 text-2xl font-bold">Personalized News</h1>
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

         {/* Filters Section */}
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
            <div className="flex items-start space-x-4">
               <input type="text" placeholder="Search" className="w-full p-2 border border-gray-300 " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               <button onClick={addSearchKeyword} className="p-2 text-white bg-blue-500 ">
                  Search
               </button>
            </div>
         </div>

         {/* News Cards */}
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.length > 0 ? (
               filteredNews.map((article, index) => (
                  <PersonalizedNewsCard key={index} article={article} />
               ))
            ) : (
               <p className="text-gray-500">No news found matching the filters.</p>
            )}
         </div>

         {/* Pagination Controls */}
         <div className="flex justify-between mt-4">
            <button
               onClick={() => handlePagination("prev")}
               disabled={currentPage === 1}
               className="px-4 py-2 bg-gray-300 rounded-md"
            >
               Previous
            </button>
            <span className="flex items-center">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
               onClick={() => handlePagination("next")}
               disabled={currentPage === totalPages}
               className="px-4 py-2 bg-gray-300 rounded-md"
            >
               Next
            </button>
         </div>
      </div>
   );
};

export default PersonalizedNewsPage;
