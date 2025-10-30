import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaPen, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dummyaso from "../../assets/dummyaso.webp";
import EditProfile from './EditProfile';

const Editprologin = () => {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-[40rem] bg-[#441410] flex justify-center items-center relative overflow-hidden">
      {/* Back Button */}
      {!showProfileEdit && (
        <div className="absolute top-6 left-6 z-50">
          <button
            className="flex items-center text-white text-sm"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft className="w-4 h-4 mr-2 cursor-pointer" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-full px-4 pb-3">
        {/* Left Panel */}
        <div
          className={`transition-transform duration-500 ${showProfileEdit ? 'translate-x-[-120%]' : 'translate-x-0'}`}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
            style={{ background: 'linear-gradient(to bottom, #C099992B 18%, #FFFFFF 18%)' }}
          >
            {/* Profile Picture */}
            <div className="flex items-center justify-center flex-col mb-6">
              <img src={dummyaso} alt="Profile" className="rounded-full w-24 h-24 object-cover" />
              <button className="cursor-pointer flex items-center text-[#8B5E3C] text-sm hover:underline ml-2 mt-1">
                <FaPen className="mr-1" /> Edit profile picture
              </button>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-[#91231A] text-center mb-6">Associate Director</h1>

            {/* Form Fields */}
            <div className="space-y-4 mb-6 text-[#191A1F]">
              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
                <FaUserCircle className="text-[#4A2C2A] w-5 h-5 mr-2" />
                <input type="text" defaultValue="Mrs. Samantha Jones" className="w-full bg-transparent outline-none text-sm" />
              </div>

              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
                <FaEnvelope className="text-[#4A2C2A] w-5 h-5 mr-2" />
                <input type="email" defaultValue="samantha.jones@primuspartners.in" className="w-full bg-transparent outline-none text-sm" />
              </div>

              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
                <FaPhone className="text-[#4A2C2A] w-5 h-5 mr-2" />
                <input type="tel" defaultValue="+91 7000000000" className="w-full bg-transparent outline-none text-sm" />
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <button
              className="w-full mt-4 py-2.5 px-4 rounded-md text-sm font-medium text-white transition-colors"
              style={{ background: 'linear-gradient(to right, #AD8051, #473521)' }}
              onClick={() => setShowProfileEdit(true)}
            >
              Edit details
            </button>
          </div>
        </div>

        {/* Right Panel: EditProfile */}
        {showProfileEdit && (
          <div className="absolute top-0 left-0 w-full transition-opacity duration-500 z-30 bg-white rounded-lg">
            <EditProfile onBack={() => setShowProfileEdit(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Editprologin;