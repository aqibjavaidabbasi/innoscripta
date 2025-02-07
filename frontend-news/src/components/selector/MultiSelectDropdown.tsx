import React, { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedOptions, setTempSelectedOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options: Remove already selected items (from parent & temp selections)
  const filteredOptions = Array.isArray(options)
    ? options.filter(
        (option) =>
          !selectedOptions.includes(option) &&
          !tempSelectedOptions.includes(option) &&
          option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle selecting/deselecting options
  const toggleTempOption = (option: string) => {
    setTempSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option) // Remove if exists
        : [...prevSelected, option] // Add if not exists
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Submit selected options to parent state
  const handleSubmit = () => {
    setSelectedOptions((prev) => [...prev, ...tempSelectedOptions]);
    setTempSelectedOptions([]);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Display Selected Options */}
      <div className="flex items-start space-x-4">
        <div
          className="flex flex-wrap w-full gap-2 p-2 bg-white border border-gray-300 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {tempSelectedOptions.length > 0 ? (
            tempSelectedOptions.map((option) => (
              <span
                key={option}
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTempOption(option);
                }}
              >
                {option} ✕
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select options...</span>
          )}
        </div>
        <button
          className="p-2 text-white bg-green-500 w-fit hover:bg-green-600"
          onClick={handleSubmit}
        >
          Add
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg max-h-60">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b border-gray-300"
          />

          {/* Options List */}
          <ul className="p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleTempOption(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
