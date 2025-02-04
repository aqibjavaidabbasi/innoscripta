import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Avatar from "react-avatar";
import { IoMdSearch } from "react-icons/io";
import NewsContext from "../../context/NewsContext";

const Header: React.FC = () => {

   const location = useLocation();
   const navigate = useNavigate();
   const [menuOpen, setMenuOpen] = useState(false);
   const { filterQuery, setFilterQuery } = useContext(NewsContext);

   const isLogin = false;

   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterQuery({
         ...filterQuery,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <header className="bg-headerBg text-white shadow-lg">
         {/* Top navigation bar */}
         <div className="container mx-auto flex justify-between items-center p-4">
            <Link to="/" className="text-3xl font-bold">
               COMPANY NAME
            </Link>

            {/* Desktop Navigation */}
            <div className=" space-x-6 hidden md:flex">
               <nav className="hidden md:flex items-center space-x-6 text-gray-300">
                  <Link to="/blog" className="hover:text-white">Blog</Link>
                  <Link to="/awards" className="hover:text-white">Awards</Link>
                  <Link to="/events" className="hover:text-white">Events</Link>
                  <Link to="/help" className="hover:text-white">Help</Link>
                  <Link to="/about" className="hover:text-white">About Us</Link>
               </nav>
               {isLogin ? <div className="flex space-x-4 items-center">
                  <button
                     className="border border-white px-6 py-2 hover:bg-white hover:text-black"
                     onClick={() => navigate("/")}
                  >
                     Logout
                  </button>
                  <div className='w-9 h-9 rounded-full border-2 border-white'>
                     <Avatar
                        name={"User Name"}
                        color="transparent"
                        fgColor="white"
                        className='w-full h-full'
                        size='100%'
                        round='100%'
                        src={""}
                     />
                  </div>
               </div> : <div className="hidden md:flex ">
                  {location.pathname !== "/login" && <button
                     className="border border-white px-6 py-2 hover:bg-white hover:text-black"
                     onClick={() => navigate("/login")}
                  >
                     Login
                  </button>}
                  {location.pathname !== "/signup" && <button
                     className="border border-white px-6 py-2 hover:bg-white hover:text-black"
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
            className={`md:hidden bg-headerBg absolute top-16 left-0 w-full transform transition-all ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
               } overflow-hidden`}
         >
            <nav className="flex flex-col items-start ps-8   space-y-4 py-4 text-white">
               <Link to="/blog" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>
                  Blog
               </Link>
               <Link to="/awards" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>
                  Awards
               </Link>
               <Link to="/events" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>
                  Events
               </Link>
               <Link to="/help" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>
                  Help
               </Link>
               <Link to="/about" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>
                  About Us
               </Link>
               {isLogin && <button
                  className="border border-white px-6 py-2 hover:bg-white hover:text-black"
                  onClick={() => navigate("/login")}
               >
                  Logout
               </button>}
               {isLogin ? <div className="flex space-x-4 items-center">
                  <div className='w-9 h-9 rounded-full border-2 border-white'>
                     <Avatar
                        name={"User Name"}
                        color="transparent"
                        fgColor="white"
                        className='w-full h-full'
                        size='100%'
                        round='100%'
                        src={""}
                     />
                  </div>
                  <div>
                     User Name
                  </div>
               </div> : <div>
                  {location.pathname !== "/login" && <button
                     className="border  border-white px-6 py-2 hover:bg-white hover:text-black "
                     onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                     }}
                  >
                     Login
                  </button>}
                  {location.pathname !== "/signup" && <button
                     className="border border-white px-6 py-2 hover:bg-white hover:text-black "
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
         <div className="hidden md:block bg-headerBg ">
            <div className="container mx-auto flex justify-between items-center py-3 px-4">
               <nav className="flex space-x-6 text-white">
                  <Link to="/news" className="hover:text-gray-400">News</Link>
                  <Link to="/hubs" className="hover:text-gray-400">Hubs</Link>
                  <Link to="/learn" className="hover:text-gray-400">Learn</Link>
                  <Link to="/store" className="hover:text-gray-400">Store</Link>
               </nav>
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4">
                     <input
                        type="text"
                        name="keyword"
                        placeholder="Search by keyword"
                        className="p-2 text-black rounded-md"
                        value={filterQuery.keyword}
                        onChange={handleFilterChange}
                     />
                     <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        className="p-2 text-black rounded-md"
                        value={filterQuery.category}
                        onChange={handleFilterChange}
                     />
                     <input
                        type="text"
                        name="source"
                        placeholder="Source"
                        className="p-2 text-black rounded-md"
                        value={filterQuery.source}
                        onChange={handleFilterChange}
                     />
                     <input
                        type="date"
                        name="start_date"
                        className="p-2 text-black rounded-md"
                        value={filterQuery.start_date}
                        onChange={handleFilterChange}
                     />
                     <input
                        type="date"
                        name="end_date"
                        className="p-2 text-black rounded-md"
                        value={filterQuery.end_date}
                        onChange={handleFilterChange}
                     />
                  </div>
                  <button
                     className="border border-white  p-2 hover:bg-white hover:text-black"
                  // onClick={() => {
                  //    setSearchOpen(false);
                  // }}
                  >
                     <IoMdSearch />
                  </button>
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
