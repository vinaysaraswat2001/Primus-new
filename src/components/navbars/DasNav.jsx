// src/components/Dashboard/DasNav.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import Primuslogo from "../../assets/primuslogo.png";
import NotificationPopup from "../Popups/NotificationPopup";
import bellnoti from "../../assets/bellnoti.webp";
import { logoutUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../../redux/store";

// Import modal-flow components
import EmailVerification from "../auth/EmailVerification"; // adjust path if needed
import ResetPassword from "../auth/ResetPassword"; // adjust path if needed

const DasNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // modalView controls what is shown in the centered modal:
  // null = nothing, "profile" = profile card, "forgot-otp" = EmailVerification, "forgot-reset" = ResetPassword
  const [modalView, setModalView] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isEditProfile = location.pathname === "/dashboard/edit-profile-login";
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      await persistor.purge();
      localStorage.removeItem("g-recaptcha-response");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Open forgot-password flow inside modal (close profile card first)
  const openForgotFlow = () => {
    setProfileMenuOpen(false);
    setModalView("forgot-otp");
  };

  const closeAllModals = () => {
    setProfileMenuOpen(false);
    setModalView(null);
  };

  const linkClasses = ({ isActive }) =>
    `cursor-pointer px-2 py-2 rounded-full transition-colors ${isActive ? "bg-[#102437] text-white" : "text-black"
    }`;

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
          <NavLink to="dashboard" className={linkClasses} end>
            Dashboard
          </NavLink>
          <NavLink to="project-overview" className={linkClasses}>
            Overview
          </NavLink>
          <NavLink to="know-your-team" className={linkClasses}>
            Team
          </NavLink>
          <NavLink to="meetings" className={linkClasses}>
            Meetings
          </NavLink>
          <NavLink to="reach-out" className={linkClasses}>
            Reach Out
          </NavLink>
          <NavLink to="share-feedback" className={linkClasses}>
            Share Feedback
          </NavLink>
          <NavLink to="document-library" className={linkClasses}>
            Document Library
          </NavLink>
          <NavLink to="publications" className={linkClasses}>
            Publications
          </NavLink>
        </div>

        {/* RIGHT – notification + profile */}
        <div className="flex items-center gap-4 relative">
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
            title="Profile"
            onClick={() => {
              // toggles profile card modal
              const next = !(profileMenuOpen || modalView === "profile");
              setProfileMenuOpen(next);
              setModalView(next ? "profile" : null);
            }}
          >
            <FaUser className="w-6 h-6 text-[#102437]" />
          </div>
        </div>
      </nav>

      {/* ---------- MOBILE MENU ---------- */}
      {menuOpen && !isEditProfile && (
        <div className="md:hidden bg-white text-black flex flex-col items-center space-y-4 py-4 shadow-md z-[99999]">
          <NavLink to="" className={linkClasses} onClick={() => setMenuOpen(false)} end>
            Dashboard
          </NavLink>
          <NavLink to="project-overview" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Overview
          </NavLink>
          <NavLink to="team" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Team
          </NavLink>
          <NavLink to="meetings" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Meetings
          </NavLink>
          <NavLink to="reach-out" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Reach Out
          </NavLink>
          <NavLink to="share-feedback" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Share Feedback
          </NavLink>
          <NavLink to="document-library" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Document Library
          </NavLink>
          <NavLink to="publications" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Publications
          </NavLink>
        </div>
      )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div>
        <Outlet />
      </div>

      {/* ---------- CENTERED MODAL (profile / forgot OTP / reset) ---------- */}
      {modalView && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-700/40 backdrop-blur-sm z-50 transition-opacity duration-200"
            onClick={closeAllModals}
          />

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-[60] px-4">
            <div className="bg-white w-[40rem] p-6 sm:p-8 rounded-2xl shadow-2xl relative border border-blue-100">
              {/* Close */}
              <button
                className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-blue-600 text-lg bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center"
                onClick={closeAllModals}
                aria-label="Close"
              >
                ✕
              </button>

              {/* ---------- PROFILE CARD ---------- */}
              {modalView === "profile" && (
                <>
                  <div className="relative mx-auto w-28 h-28 mb-4">
                    <div className="absolute inset-0 bg-[#102437] rounded-full p-1">
                      <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white"
                      />
                    </div>
                  </div>

                  <div className="bg-[#102437] text-white px-4 py-1 rounded-full text-sm font-semibold text-center mx-auto mb-3 w-fit">
                    Automotive
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Mrs. Samantha Jones
                  </h2>

                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                    {[
                      { icon: <FaUser className="text-blue-600 text-sm" />, text: "Mrs. Samantha Jones" },
                      { icon: <FaEnvelope className="text-blue-600 text-sm" />, text: "Samantha.jones@primuspartners.in" },
                      { icon: <FaPhone className="text-blue-600 text-sm" />, text: "+91 7000989000" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white p-2 rounded-lg shadow-sm transition-shadow duration-200 border border-blue-100"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg mr-3 flex items-center justify-center">{item.icon}</div>
                        <span className="text-gray-700 font-medium text-sm sm:text-base">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={openForgotFlow}
                      className="cursor-pointer bg-[#102437] text-white px-6 py-3 rounded-3xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Forgot Password
                    </button>

                    <button
                      onClick={handleLogout}
                      className="cursor-pointer bg-red-600 text-white px-6 py-3 rounded-3xl text-sm font-semibold shadow-md hover:bg-red-700 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}

              {/* ---------- EMAIL VERIFICATION (OTP) ---------- */}
              {modalView === "forgot-otp" && (
                <div className="w-[37rem] max-h-[70vh] bg-white rounded-2xl p-4 overflow-hidden flex items-center justify-center">
                  <EmailVerification
                    onBack={() => setModalView("profile")}
                    onVerified={() => setModalView("forgot-reset")}
                    email={"Samantha.jones@primuspartners.in"}
                  />
                </div>
              )}


              {/* ---------- RESET PASSWORD ---------- */}
              {modalView === "forgot-reset" && (
                <ResetPassword
                  onDone={() => {
                    // close modal after successful reset
                    setModalView(null);
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DasNav;