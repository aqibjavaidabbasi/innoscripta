import React, { useEffect, useState } from "react";
import { setUserPreferences, getUserPreferences, fetchCategories, fetchSources, fetchAuthors } from "../../services/newsService";

interface UserPreferences {
   preferred_sources: string[];
   preferred_categories: string[];
   preferred_authors: string[];
}

const Settings: React.FC = () => {
   const [userPreferences, setUserPreferencesState] = useState<UserPreferences | null>(null);
   const [categories, setCategories] = useState<string[]>([]);
   const [sources, setSources] = useState<string[]>([]);
   const [authors, setAuthors] = useState<string[]>([]);

   const [loader, setLoader] = useState<boolean>(false)

   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedSources, setSelectedSources] = useState<string[]>([]);
   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

   useEffect(() => {
      const loadData = async () => {
         try {
            // Fetch categories, sources, and authors
            const categoriesData = await fetchCategories();
            const sourcesData = await fetchSources();
            const authorsData = await fetchAuthors();
            setCategories(categoriesData?.categories || []);
            setSources(sourcesData?.sources || []);
            setAuthors(authorsData?.authors || []);

            // Fetch user preferences either from API or localStorage
            const savedPreferences = localStorage.getItem("userPreferences");
            let preferences: UserPreferences | null = null;

            if (savedPreferences) {
               preferences = JSON.parse(savedPreferences);
            } else {
               preferences = await getUserPreferences();
               // Save preferences in localStorage if not found
               localStorage.setItem("userPreferences", JSON.stringify(preferences));
            }

            // Update state with preferences
            if (preferences) {
               setUserPreferencesState(preferences);
               setSelectedCategories(preferences.preferred_categories || []);
               setSelectedSources(preferences.preferred_sources || []);
               setSelectedAuthors(preferences.preferred_authors || []);
            }
         } catch (error) {
            console.error("Error loading data:", error);
         }
      };

      loadData();
   }, []); // Run once on component mount

   const toggleSelection = (
      value: string,
      selectedList: string[],
      setFunction: React.Dispatch<React.SetStateAction<string[]>>
   ) => {
      setFunction((prev) =>
         prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
      );
   };

   const handleSavePreferences = async () => {
      setLoader(true)
      try {
         const updatedPreferences: UserPreferences = {
            preferred_sources: selectedSources,
            preferred_categories: selectedCategories,
            preferred_authors: selectedAuthors,
         };

         await setUserPreferences(updatedPreferences);
         setTimeout(() => {
            setLoader(false)
         }, 1000)
         localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences)); // Update stored preferences
      } catch (error) {
         console.error("Error updating preferences:", error);
         alert("Failed to update preferences.");
      }
   };

   return (
      <div className="relative p-6 mx-auto">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">User Preferences</h1>
            <button
               onClick={handleSavePreferences}
               className="px-4 py-2 mt-6 text-white transition bg-blue-500 rounded hover:bg-blue-600"
            >
               Save Preferences
            </button>
         </div>

         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
               <h2 className="col-span-2 mb-2 text-lg font-semibold">Preferred Categories</h2>
               <div className="grid max-h-[58vh] grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 p-4 overflow-auto border rounded-lg shadow-md">
                  {categories.map((category, index) => (
                     <div key={index} className="flex items-center space-x-2">
                        <input
                           type="checkbox"
                           checked={selectedCategories.includes(category)}
                           onChange={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
                        />
                        <label>{category}</label>
                     </div>
                  ))}
               </div>
            </div>

            <div className="h-full">
               <h2 className="mb-2 text-lg font-semibold">Preferred Sources</h2>
               <div className="grid max-h-[58vh] grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 p-4 overflow-auto border rounded-lg shadow-md">
                  {sources.map((source, index) => (
                     <div key={index} className="flex items-center space-x-2">
                        <input
                           type="checkbox"
                           checked={selectedSources.includes(source)}
                           onChange={() => toggleSelection(source, selectedSources, setSelectedSources)}
                        />
                        <label>{source}</label>
                     </div>
                  ))}
               </div>
            </div>

            <div className="">
               <h2 className="mb-2 text-lg font-semibold">Preferred Authors</h2>
               <div className="grid max-h-[58vh] grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 p-4 overflow-auto border rounded-lg shadow-md">
                  {authors.map((author, index) => (
                     <div key={index} className="flex items-center space-x-2">
                        <input
                           type="checkbox"
                           checked={selectedAuthors.includes(author)}
                           onChange={() => toggleSelection(author, selectedAuthors, setSelectedAuthors)}
                        />
                        <label>{author}</label>
                     </div>
                  ))}
               </div>
            </div>
         </div> 
         {loader && <div
            className="absolute bottom-full right-0 py-4 px-6 w-80 border-2 border-b-6 border-b-orange-500 border-white shadow-white text-gray-200 shadow-xl bg-[#232124] ease-linear"
         >
            <p>Prefrences Updated Successfully..</p>
         </div>
         }
      </div>
   );
};

export default Settings;
