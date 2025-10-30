import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaArrowLeft, FaTimes } from 'react-icons/fa';
import TeamRolesPopup from '../Popups/TeamRolesPopup';
import Footer from '../navbars/Footer/Footer';

const ProjectReachOut = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const togglePopup = () => setShowPopup(!showPopup);
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
     <>
    <div className="lg:col-span-2 space-y-6 mt-0.1 overflow-y-auto">
      <div className="bg-[#441410] p-8">
        {/* Header with back arrow */}
        <div
          className="flex items-center gap-3 mb-6 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <FaArrowLeft className="text-white text-lg" />
          <h1 className="text-2xl font-bold text-white">
            Connect with our PMs, experts & MDs..
          </h1>
        </div>

        {/* Expert Selection Dropdown */}
        <div className="relative">
          <div
            className="w-full bg-[#441410] text-white px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
            onClick={togglePopup}
          >
            <span>Select the PM/SME/MD to talk with</span>
            <FaChevronDown
              className={`text-white transform transition-transform duration-300 ${
                showPopup ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Popup aligned to the right */}
          {showPopup && (
            <div className="absolute right-1 mt-1 z-50">
              <TeamRolesPopup onClose={togglePopup} />
            </div>
          )}
        </div>
      </div>

      {/* Email Composition Section */}
      <div className="mb-6 p-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Write an email to our PM/SME/MD...
        </h2>

        {/* Subject Field */}
        <div className="flex items-center mb-4 bg-[#F5F5F5] rounded-md">
          <input
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-2 bg-[#F5F5F5] text-black rounded-md focus:outline-none placeholder-gray"
          />
        </div>

        {/* Date Picker Section */}
        <div className="mb-6 relative flex justify-end">
          <div
            className="w-full bg-[#441410] text-white px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
            onClick={toggleDatePicker}
          >
            <span>{selectedDate || 'Schedule the calendar'}</span>
            <FaChevronDown
              className={`text-white transform transition-transform duration-300 ${
                showDatePicker ? 'rotate-180' : ''
              }`}
            />
          </div>

          {showDatePicker && (
            <div className="absolute z-50 mt-11 w-[18rem] right-0 bg-white border border-gray-300 rounded-md shadow-lg p-2">
              <div className="text-center font-semibold mb-2 text-[#441410]">July 2025</div>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center font-medium text-gray-500">{day}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <div
                    key={date}
                    className="text-center text-sm p-1 hover:bg-blue-100 rounded cursor-pointer"
                    onClick={() => handleDateSelect(`2025-07-${String(date).padStart(2, '0')}`)}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Field with File Upload */}
        <div className="relative bg-[#F5F5F5] rounded-md px-4 py-2">
          <textarea
            placeholder="Type a message......"
            rows="4"
            className="w-full rounded-md focus:outline-none bg-[#F5F5F5] text-black resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          {/* Selected file name + remove icon below textarea on left */}
          {selectedFile && (
            <div className="flex items-center gap-2 mt-2 max-w-[10%] text-sm text-gray-700 bg-white rounded px-3 py-1 truncate">
              <span className="truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={removeSelectedFile}
                className="text-gray-400 hover:text-gray-700 focus:outline-none"
                aria-label="Remove selected file"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* File upload button bottom right */}
          <label className="absolute bottom-2 right-2 cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            <div className="w-8 h-8 rounded-full bg-[#441410] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.656L5.343 11.172a6 6 0 108.485 8.485"
                />
              </svg>
            </div>
          </label>
        </div>

        {/* Action Button Centered */}
        <div className="flex justify-center">
          <button className="w-[56.25rem] mt-5 px-4 py-2 bg-[#142434] text-white rounded-md cursor-pointer">
            Schedule a call
          </button>
        </div>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default ProjectReachOut;