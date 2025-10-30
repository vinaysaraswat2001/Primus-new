import { useState, useEffect } from 'react';

const FilterPopup = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true); // Start open since triggered externally

  useEffect(() => {
    setIsOpen(true); // Ensure popup is open when mounted
  }, []);

  if (!isOpen) return null;

  return (
    <div className="absolute mt-1 -ml-44 w-64 bg-white p-4 rounded-lg shadow-lg border border-gray-300 z-50">
      <div className="space-y-3">
        <div>
          <label className="text-[#441410] font-medium text-sm">Date</label>
          <input
            type="date"
            className="w-full mt-1 p-1 border border-gray-300 rounded-md text-[#441410] text-sm focus:outline-none focus:ring-2 focus:ring-[#441410]"
          />
        </div>
        <div>
          <label className="text-[#441410] font-medium text-sm">Project Name</label>
          <input
            type="text"
            className="w-full mt-1 p-1 border border-gray-300 rounded-md text-[#441410] text-sm focus:outline-none focus:ring-2 focus:ring-[#441410]"
          />
        </div>
        <div>
          <label className="text-[#441410] font-medium text-sm">PM’s Name</label>
          <input
            type="text"
            className="w-full mt-1 p-1 border border-gray-300 rounded-md text-[#441410] text-sm focus:outline-none focus:ring-2 focus:ring-[#441410]"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="px-2 py-1 text-[#441410] font-medium text-sm border border-[#441410] rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="px-2 py-1 bg-[#441410] text-white font-medium text-sm rounded-md hover:bg-opacity-90"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;