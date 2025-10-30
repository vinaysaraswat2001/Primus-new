import React, { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import dummyaso from "../../assets/dummyaso.webp"; // Use real images if available

const NotificationPopup = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      name: "Amit Sharma",
      message: "Sent you a project update",
      image: dummyaso,
    },
    {
      id: 2,
      name: "Priya Mehta",
      message: "Requested document approval",
      image: dummyaso,
    },
    {
      id: 3,
      name: "Riya Sen",
      message: "Shared new project files",
      image: dummyaso,
    },
  ];

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        className="bg-white text-[#441410] p-3 cursor-pointer rounded-md relative"
        onClick={() => setOpen(!open)}
      >
        <FaBell className="text-lg" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-[6px] py-[1px]">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-[320px] bg-white rounded-lg shadow-lg border z-50">
          {/* Header with Close Icon */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#441410]">
                Notifications{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({notifications.length} new)
                </span>
              </h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-red-600 transition"
              aria-label="Close notification popup"
            >
              <FaTimes />
            </button>
          </div>

          {/* Notification List */}
          <ul className="max-h-64 overflow-y-auto">
            {notifications.map((noti) => (
              <li
                key={noti.id}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition"
              >
                <img
                  src={noti.image}
                  alt={noti.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm text-gray-800">
                  <span className="font-medium">{noti.name}</span>:{" "}
                  <span className="text-gray-600">{noti.message}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;