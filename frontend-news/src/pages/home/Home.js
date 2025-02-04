import React, { useContext } from 'react';
import NewsContext from '../../context/NewsContext';
import NewsCard from '../../components/newsCard/NewsCard';

const Home = () => {
   const newsContext = useContext(NewsContext);

   if (!newsContext) {
      return <div className="text-center text-gray-500">Loading...</div>;
   }

   const { news } = newsContext;

   return (
      <div className="flex flex-col items-center justify-center ">
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Latest News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {news.length > 0 ? (
                  news.map((article, index) => (
                     <NewsCard key={index} article={article} />
                  ))
               ) : (
                  <p className="text-gray-500">No news available</p>
               )}
            </div>
         </div>
      </div>
   );
};

export default Home;