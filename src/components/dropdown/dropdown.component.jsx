import { useState } from "react";

const  Dropdown = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false); // Close the dropdown after selecting
    // if (onSelect) {
    //   onSelect(item); // Pass the selected item to the parent
    // }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-bold text-white rounded-md shadow-sm focus: outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedItem ? selectedItem : label}
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.67l3.71-3.44a.75.75 0 111.04 1.08l-4 3.75a.75.75 0 01-1.04 0l-4-3.75a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[1001] mt-2 w-full rounded-md bg-white shadow-lg">
          <ul className="py-1 text-sm text-gray-700 max-h-40 overflow-y-auto">
            {items.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelect(item.label)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
