import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import Primuslogo from "./primuslogo.png";
import NotificationPopup from "./NotificationPopup";
import bellnoti from "./bellnoti.webp";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { persistor } from "../redux/store"; //
const AlumniNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEditProfile = location.pathname === "/dashboard/edit-profile-login";
  const dispatch=useDispatch();
  // Black text by default, active link with bg and white text
  const linkClasses = ({ isActive }) =>
    `cursor-pointer px-2 py-2 rounded-full transition-colors ${isActive
      ? "bg-[#102437] text-white"   // active: background + white text
      : "text-black"                // default: black text, no hover effect
    }`;

const handleLogout = async () => {
  try {
    // 1️⃣ Dispatch Redux action (clears user slice + localStorage)
    dispatch(logoutUser());

    // 2️⃣ Purge persisted Redux state (_persist + others)
    await persistor.purge();

    // 3️⃣ Remove any other tokens or extra data
    localStorage.removeItem("g-recaptcha-response");

    // 4️⃣ Redirect user to login page
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="flex flex-col z-[99999]">
      {/* ---------- TOP NAVBAR ---------- */}
      <nav className="text-black px-3 py-3 flex items-center justify-between z-[20]">
        {/* LEFT – logo + hamburger */}
        <div className="flex items-center gap-3">
          <img
            src={Primuslogo}
            alt="Company Logo"
            className="h-20 w-20 md:h-11 md:w-30 cursor-pointer"
            loading="lazy"
            onClick={() => navigate("/home")}
          />

          {!isEditProfile && (
            <button
              className="md:hidden text-black text-2xl focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? (
                <FaTimes className="border-2 border-black rounded-full p-1" size={28} />
              ) : (
                <FaBars size={28} />
              )}
            </button>
          )}
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-[13px] font-medium bg-white rounded-full px-6 py-2 shadow-md">
          <NavLink to="alumni-home" className={linkClasses}>Home</NavLink>
          <NavLink to="teams" className={linkClasses}>Directory</NavLink>
          <NavLink to="community" className={linkClasses}>Community</NavLink>
          <NavLink to="event" className={linkClasses}>Events</NavLink>
          <NavLink to="job-portal" className={linkClasses}>Jobs</NavLink>
          <NavLink to="news" className={linkClasses}>News</NavLink>
          <NavLink to="help-desk" className={linkClasses}>Helpdesk</NavLink>
          <NavLink to="survey" className={linkClasses}>Survey</NavLink>

          {/* <NavLink to="advisory-invoice" className={linkClasses}>Invoice</NavLink>
          <NavLink to="advisory-business-leads" className={linkClasses}>Business Leads</NavLink>
          <NavLink to="advisory-surveys" className={linkClasses}>Surveys</NavLink>
          <NavLink to="advisory-job-portal" className={linkClasses}>Jobs</NavLink> */}
        </div>

        {/* RIGHT – notification + profile */}
        <div className="flex items-center gap-4">
          <NotificationPopup>
            <img
              src={bellnoti}
              alt="Notifications"
              title="Notifications"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
          </NotificationPopup>


          {/* Profile Icon */}
          <div
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer relative"
            title="Edit Profile"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
          >
            <FaUser className="w-6 h-6 text-[#102437]" />
          </div>

          {/* Dropdown for logout */}
          {profileMenuOpen && (
            <div className="absolute top-16 right-0 bg-white border rounded shadow-md w-32 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ---------- MOBILE MENU ---------- */}
      {menuOpen && !isEditProfile && (
        <div className="md:hidden bg-white text-black flex flex-col items-center space-y-4 py-4 shadow-md z-[99999]">
          <NavLink to="alumni-home" className={linkClasses} end>Home</NavLink>
          <NavLink to="teams" className={linkClasses}>Directory</NavLink>
          <NavLink to="community" className={linkClasses}>Community</NavLink>
          <NavLink to="event" className={linkClasses}>Events</NavLink>
          <NavLink to="news" className={linkClasses}>News</NavLink>
          <NavLink to="help-desk" className={linkClasses}>Helpdesk</NavLink>
          <NavLink to="survey" className={linkClasses}>Survey</NavLink>
        </div>
      )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AlumniNav;