import React from 'react';

const Footer: React.FC = () => {
   return (
      <footer className="py-6 mt-auto text-white bg-gray-800">
         <div className="container mx-auto text-center">
            <p className="text-sm">
               &copy; {new Date().getFullYear()} News App. All rights reserved.
            </p>
         </div>
      </footer>
   );
};

export default Footer;