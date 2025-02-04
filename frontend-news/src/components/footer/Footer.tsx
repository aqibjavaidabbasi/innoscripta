import React from 'react';

const Footer: React.FC = () => {
   return (
      <footer className="bg-gray-800 text-white py-6 mt-auto">
         <div className="container mx-auto text-center">
            <p className="text-sm">
               &copy; {new Date().getFullYear()} News App. All rights reserved.
            </p>
         </div>
      </footer>
   );
};

export default Footer;