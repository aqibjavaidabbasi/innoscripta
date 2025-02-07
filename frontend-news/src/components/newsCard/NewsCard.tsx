import React from "react";

interface NewsCardProps {
   article: {
      title: string;
      description: string | null;
      url: string;
      image?: string;
      source: string;
      publishedAt: string;
   };
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
   return (
      <div className="p-4 transition duration-300 bg-white border-2 border-gray-200 shadow-md hover:shadow-lg">
         <h2 className="hidden pb-6 text-lg font-bold text-gray-800 transition duration-300 md:block hover:text-blue-600">
            {article.title}
         </h2>
         <div className="grid grid-cols-7 gap-4 text-sm">
            {article?.image && (
               <div className="col-span-7 md:col-span-3">
                  <img
                     src={article.image}
                     alt={article.title}
                     className="object-cover w-full mb-3 rounded-lg h-fit"
                  />
               </div>
            )}
            <h2 className="col-span-7 py-4 text-lg font-bold text-gray-800 transition duration-300 md:hidden hover:text-blue-600">
               {article.title}
            </h2>
            <div className="col-span-7 md:col-span-4">
               <div className="w-12 border border-red-500"></div>
               <p className="mt-1 text-sm font-medium text-gray-600">{article.source}</p>

               <p className="mt-2 text-sm text-gray-600 line-clamp-3">{article.description}</p>
               <p className="mt-2 text-sm text-gray-400">{article.publishedAt}</p> 
            </div>
         </div>
         <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 font-semibold text-blue-500 hover:underline"
         >
            Read more →
         </a>
      </div>
   );
};

export default NewsCard;
