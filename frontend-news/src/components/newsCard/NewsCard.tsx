import React from 'react';

interface NewsCardProps {
   article: {
      urlToImage?: string;
      title: string;
      description: string;
      url: string;
      source: {
         name: string;
      };
      publishedAt: string;
   };
}

const NewsCard = ({ article }: NewsCardProps) => {
   return (
      <div className="bg-white border-2 border-gray-200  shadow-md p-4 hover:shadow-lg transition  duration-300">
         <h2 className="text-lg hidden md:block pb-6 font-bold text-gray-800 hover:text-blue-600 transition duration-300">
            {article.title}
         </h2>
         <div className="grid grid-cols-7 text-sm gap-4">
            {article.urlToImage && (
               <div className="col-span-7 md:col-span-3">
                  <img
                     src={article?.urlToImage}
                     alt={article?.title}
                     className="w-full h-fit object-cover rounded-lg mb-3"
                  />
               </div>
            )}
            <h2 className="text-lg py-4 col-span-7 md:hidden font-bold text-gray-800 hover:text-blue-600 transition duration-300">
               {article.title}
            </h2>
            <div className="col-span-7 md:col-span-4">
               <div className="border border-red-500  w-12"></div>
               <p className="text-sm text-gray-600 font-medium mt-1">{article?.source?.name}</p>
               <p className="text-gray-600 text-sm mt-2 line-clamp-3">{article?.description}</p>
               <p className="text-gray-400 text-sm mt-2 line-clamp-1">{article?.publishedAt}</p>
            </div>
         </div>
         <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-semibold mt-2 inline-block hover:underline"
         >
            Read more →
         </a>
      </div>
   );
};

export default NewsCard;
