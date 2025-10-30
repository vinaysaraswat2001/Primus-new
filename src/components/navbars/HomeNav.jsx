import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Primuslogo from "../../assets/primuslogo.png";
import { useNavigate } from "react-router-dom";

const HomeNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Smooth scroll to a section by id
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="bg-white fixed top-6 left-1/2 transform -translate-x-1/2
             w-[90%] md:w-[80%] rounded-full shadow-md
             px-4 md:px-8 py-3 flex items-center justify-between z-50"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={Primuslogo}
            alt="Primus Logo"
            className="h-10 w-auto cursor-pointer object-contain"
            loading="lazy"
            onClick={() => scrollToSection("hero")} // scroll to top section
          />
        </div>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8 text-gray-800 font-medium">
          <button
            className="cursor-pointer hover:text-black relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            onClick={() => scrollToSection("hero")}
          >
            Home
          </button>
          <button
            className="cursor-pointer hover:text-black relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>
          <button
            className="cursor-pointer hover:text-black relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            onClick={() => scrollToSection("services")}
          >
            Services
          </button>
        </div>

        {/* Right side - Login */}
        <div className="hidden md:flex">
          <button
            className="cursor-pointer   bg-[#0F1C2E] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1b2e4a] transition"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl text-gray-800"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white flex flex-col items-center gap-4 py-4 shadow-lg md:hidden">
            <button
              className="cursor-pointer text-gray-800 text-lg font-medium"
              onClick={() => scrollToSection("hero")}
            >
              Home
            </button>
            <button
              className="cursor-pointer text-gray-800 text-lg font-medium"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>
            <button
              className="cursor-pointer text-gray-800 text-lg font-medium"
              onClick={() => scrollToSection("services")}
            >
              Services
            </button>
            <button
              className="bg-[#0F1C2E] text-white px-6 py-2 rounded-lg font-medium"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              Log In
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default HomeNav;