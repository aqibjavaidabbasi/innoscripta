import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Avatar from "react-avatar";
import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {
   const [isOpen, setIsOpen] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();
   const [menuOpen, setMenuOpen] = useState(false);
   const { isAuthenticated, logout, user } = useAuth();
   const handleLogout = () => {
      logout();
      navigate("/login");
   };

   return (
      <header className="text-white shadow-lg bg-headerBg">
         <div className="container flex items-center justify-between p-4 mx-auto">
            <Link to={isAuthenticated ? "/news-page" : "/"} className="text-3xl font-bold">
               Innoscripta Task
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden space-x-6 md:flex">
               {isAuthenticated ? <div className="flex items-center space-x-4">
                  <div className="relative inline-block">
                     <div className="p-3"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                     >
                        <div
                           className='border-2 border-white rounded-full cursor-pointer w-9 h-9'>
                           <Avatar
                              name={user?.name}
                              color="transparent"
                              fgColor="white"
                              className='w-full h-full'
                              size='100%'
                              round='100%'
                              src={""}
                           />
                        </div>
                        {isOpen && (
                           <div
                              className="absolute right-0 z-50 mt-2 text-black bg-white shadow-lg min-w-48"
                           >
                              <ul className="">
                                 <li className="px-4 py-4 bg-gray-100 cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                       <div className="w-16 h-16">
                                          <Avatar
                                             name={user?.name}
                                             color="#232124"
                                             fgColor="white"
                                             className='w-full h-full'
                                             size='100%'
                                             round='100%'
                                             src={""}
                                          />
                                       </div>
                                       <div>
                                          <p className="font-bold capitalize trancate">{user?.name}</p>
                                          <p className="text-sm trancate">{user?.email}</p>
                                       </div>
                                    </div>
                                 </li>

                                 <li className="cursor-pointer hover:bg-gray-200">
                                    <Link to="/preferences" className="" onClick={() => setMenuOpen(false)}>
                                       <div className="w-full px-4 py-2">
                                          Preferences
                                       </div>
                                    </Link>
                                 </li>
                                 <button
                                    className="w-full px-4 py-2 cursor-pointer hover:bg-gray-200 text-start hover:text-black"
                                    onClick={handleLogout}
                                 >
                                    Logout
                                 </button>
                              </ul>
                           </div>
                        )}
                     </div>
                  </div>
               </div> : <div className="hidden md:flex ">
                  {location.pathname !== "/login" && <button
                        className="px-6 py-2 border border-white hover:bg-white hover:text-black"
                     onClick={() => navigate("/login")}
                  >
                     Login
                  </button>}
                  {location.pathname !== "/signup" && <button
                        className="px-6 py-2 border border-white hover:bg-white hover:text-black"
                     onClick={() => navigate("/signup")}
                  >
                     Register
                  </button>}
               </div>}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
               {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
         </div>

         {/* Mobile Menu */}
         <div
            className={`md:hidden bg-headerBg absolute top-16 z-50 left-0 w-full transform transition-all ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
               } overflow-hidden`}
         >
            <nav className="flex flex-col items-start py-4 space-y-4 text-white ">
               {isAuthenticated ? <div className="">
                  <ul className="w-full">
                     <li className="px-4 py-4 cursor-pointer">
                        <div className="flex items-center space-x-4">
                           <div className="w-16 h-16">
                              <Avatar
                                 name={user?.name}
                                 color="#F2F3F4"
                                 fgColor="#232124"
                                 className='w-full h-full'
                                 size='100%'
                                 round='100%'
                                 src={""}
                              />
                           </div>
                           <div>
                              <p className="font-bold capitalize trancate">{user?.name}</p>
                              <p className="text-sm trancate">{user?.email}</p>
                           </div>
                        </div>
                     </li>

                     <li className="cursor-pointer hover:underline">
                        <Link to="/preferences" className="" onClick={() => setMenuOpen(false)}>
                           <div className="w-full px-4 py-2">
                              Preferences
                           </div>
                        </Link>
                     </li>
                     <button
                        className="w-full px-4 py-2 cursor-pointer hover:underline text-start"
                        onClick={handleLogout}
                     >
                        Logout
                     </button>
                  </ul>

               </div> : <div>
                  {location.pathname !== "/login" && <button
                        className="px-6 py-2 border border-white hover:bg-white hover:text-black "
                     onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                     }}
                  >
                     Login
                  </button>}
                  {location.pathname !== "/signup" && <button
                        className="px-6 py-2 border border-white hover:bg-white hover:text-black "
                     onClick={() => {
                        navigate("/signup");
                        setMenuOpen(false);
                     }}
                  >
                     Register
                  </button>}
               </div>}
            </nav>
         </div>

         {/* Main navigation bar */}
         <div className="block bg-headerBg ">
            {isAuthenticated && <div className="container flex items-center justify-between px-4 py-3 mx-auto">
               <nav className="flex space-x-6 text-white">
                  <Link to="/news-page" className="hover:text-gray-400">News</Link>
                  <Link to="/personalized-news" className="hover:text-gray-400">Personalized News</Link>
               </nav>
            </div>}
         </div>
      </header>
   );
};

export default Header;
