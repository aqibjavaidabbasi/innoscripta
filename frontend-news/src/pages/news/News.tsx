import React, { useContext } from "react";
import NewsCard from "../../components/newsCard/NewsCard";
import NewsContext from "../../context/NewsContext";

const News: React.FC = () => {
   const newsContext = useContext(NewsContext);

   if (!newsContext) {
      return <div className="text-center text-gray-500">Loading...</div>;
   }

   const { news, filterQuery } = newsContext;
   const currentDate = new Date();


   const filteredNews = news.filter((article) => {
      const matchesKeyword =
         article.title.toLowerCase().includes(filterQuery.keyword.toLowerCase()) ||
         article.description.toLowerCase().includes(filterQuery.keyword.toLowerCase());
      const matchesCategory =
         filterQuery.category === "" || article.category.toLowerCase().includes(filterQuery.category.toLowerCase());
      const matchesSource =
         filterQuery.source === "" || article.source.name.toLowerCase().includes(filterQuery.source.toLowerCase());

      const articleDate = new Date(article.publishedAt);
      const matchesStartDate = filterQuery.start_date
         ? articleDate >= new Date(filterQuery.start_date)
         : true;
      const matchesEndDate = filterQuery.end_date
         ? articleDate <= new Date(filterQuery.end_date)
         : articleDate <= currentDate;

      return (
         matchesKeyword &&
         matchesCategory &&
         matchesSource &&
         matchesStartDate &&
         matchesEndDate
      );
   });

   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">Latest News</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.length > 0 ? (
               filteredNews.map((article, index) => (
                  <NewsCard key={index} article={article} />
               ))
            ) : (
               <p className="text-gray-500">No news found matching the filters.</p>
            )}
         </div>
      </div>
   );
};

export default News;
