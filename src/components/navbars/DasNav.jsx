import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import Primuslogo from "../../assets/primuslogo.png";
import NotificationPopup from "../Popups/NotificationPopup";
import bellnoti from "../../assets/bellnoti.webp";
import { logoutUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../../redux/store";
const DasNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEditProfile = location.pathname === "/dashboard/edit-profile-login";
  const dispatch = useDispatch();
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
    <div className="flex flex-col z-[40]">
      {/* ---------- TOP NAVBAR ---------- */}
      <nav className="text-black px-3 py-3 flex items-center justify-between z-[40]">
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
          <NavLink to="dashboard" className={linkClasses} end>Dashboard</NavLink>
          <NavLink to="project-overview" className={linkClasses}>Overview</NavLink>
          <NavLink to="know-your-team" className={linkClasses}>Team</NavLink>
          <NavLink to="meetings" className={linkClasses}>Meetings</NavLink>
          <NavLink to="reach-out" className={linkClasses}>Reach Out</NavLink>
          <NavLink to="share-feedback" className={linkClasses}>Share Feedback</NavLink>
          <NavLink to="document-library" className={linkClasses}>Document Library</NavLink>
          <NavLink to="publications" className={linkClasses}>Publications</NavLink>
          {/* <NavLink to="project-attachments" className={linkClasses}>Attachments</NavLink> */}
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
          <NavLink to="" className={linkClasses} onClick={() => setMenuOpen(false)} end>Dashboard</NavLink>
          <NavLink to="project-overview" className={linkClasses} onClick={() => setMenuOpen(false)}>Overview</NavLink>
          <NavLink to="team" className={linkClasses} onClick={() => setMenuOpen(false)}>Team</NavLink>
          <NavLink to="meetings" className={linkClasses} onClick={() => setMenuOpen(false)}>Meetings</NavLink>
          <NavLink to="reach-out" className={linkClasses} onClick={() => setMenuOpen(false)}>Reach Out</NavLink>
          <NavLink to="share-feedback" className={linkClasses} onClick={() => setMenuOpen(false)}>Share Feedback</NavLink>
          <NavLink to="document-library" className={linkClasses} onClick={() => setMenuOpen(false)}>Document Library</NavLink>
          <NavLink to="publications" className={linkClasses} onClick={() => setMenuOpen(false)}>Publications</NavLink>
        </div>
      )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default DasNav;