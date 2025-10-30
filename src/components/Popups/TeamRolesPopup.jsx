import React from "react";
import { FaTimes } from "react-icons/fa";
import dummyaso from "../../assets/dummyaso.webp";

const TeamRolesPopup = ({ onClose }) => {
  const teamMembers = [
    {
      id: 1,
      name: "Amit Sharma",
      role: "Project Manager (PM)",
      image: dummyaso,
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Subject Matter Expert (SME)",
      image: dummyaso,
    },
    {
      id: 3,
      name: "Riya Sen",
      role: "Managing Director (MD)",
      image: dummyaso,
    },
  ];

  return (
    <div className="w-[320px] bg-white rounded-lg shadow-lg border z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#441410]">
          Select a Contact
          <span className="text-sm font-normal text-gray-500">
            ({teamMembers.length})
          </span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 transition"
          aria-label="Close popup"
        >
          <FaTimes />
        </button>
      </div>

      {/* Team List */}
      <ul className="max-h-64 overflow-y-auto">
        {teamMembers.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => {
              onClose(); 
            }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-800">
              <p className="font-medium">{member.name}</p>
              <p className="text-gray-500 text-xs">{member.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamRolesPopup;