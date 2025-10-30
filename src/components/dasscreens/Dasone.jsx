import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaClock, FaUsers } from "react-icons/fa";
import TimelinePhases from "./TimelinePhases";
import ProjectCalendar from "./ProjectCalendar";
import filtericon from "../../assets/filtericon.webp";
import TrendingCarousel from "./TrendingCarousel";
import Footer from "../navbars/Footer/Footer";
import FilterPopup from "../Popups/FilterPopup"; // Import the FilterPopup component


const Dasone = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to control filter popup
  const filterRef = useRef(null); // Ref to position the popup relative to the filter icon
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(
    project ? `project${project.id}` : "project1"
  );

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const projects = {
    project1: {
      name: "Project Carter 9D8801",
      value: "2.56 Cr. (INR)",
      pm: "Mr. John Doe",
      timeline: "80 days ( May 1st - July 20th 2025 )",
      paymentDone: "0.56 Cr.",
      outstanding: "2.00 Cr.",
    },
    project2: {
      name: "Project Charter 9D4801",
      value: "3.20 Cr. (INR)",
      pm: "Mr. Robert Smith",
      timeline: "90 days ( June 1st - August 30th 2025 )",
      paymentDone: "1.20 Cr.",
      outstanding: "2.00 Cr.",
    },
  };

  return (
    <>
      {/* Main content section */}
      <div className="lg:col-span-2 space-y-6 p-6 mt-0.1 overflow-y-auto">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:max-w-2x5">
            <input
              type="text"
              placeholder="Elastic search for docs, files, reports and others..."
              className="w-full pr-16 md:pr-12 pl-4 py-2 border-gray-300 rounded-md bg-[#F5F5F5] text-[#102437] font-medium"
            />
            {/* Mobile Filter Icon */}
            <img
              src={filtericon}
              alt="Filter"
              style={{ marginRight: '-1rem' }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 md:hidden"
              onClick={() => setIsFilterOpen(true)}
            />

            {/* Search Icon */}
            <FaSearch className="absolute right-11 md:right-5 top-1/2 transform -translate-y-1/2 text-[#102437] text-sm" />


            {/* ✅ Render FilterPopup on Mobile */}
            {isFilterOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-full md:hidden z-50"
                style={{ marginLeft: '16rem' }}
              >
                <FilterPopup onClose={() => setIsFilterOpen(false)} />
              </div>
            )}

          </div>

          {/* Desktop Filter Icon */}
          <div className="hidden md:block text-[#1f1f1f] cursor-pointer relative" ref={filterRef}>
            <img
              src={filtericon}
              alt="Filter"
              className="w-18 h-18 object-contain"
              onClick={() => setIsFilterOpen(true)}
            />

            {/* ✅ Render FilterPopup on Desktop */}
            {isFilterOpen && (
              <FilterPopup
                onClose={() => setIsFilterOpen(false)}
                style={{ top: '100%', left: '20%', transform: 'translateX(-20%)' }}
              />
            )}
          </div>
        </div>

        {/* Project + Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative">
                  <select
                    className="bg-[#B8854C] text-white rounded-md px-4 py-3 font-medium w-full appearance-none focus:outline-none focus:ring-2 focus:ring-[#B8854C]"
                    value={selectedProject}
                    onChange={handleProjectChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                  >
                    <option value="project1">Project Carter 9D8801</option>
                    <option value="project2">Project Charter 9D4801</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className={`fill-current h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#B8854C] text-white rounded-md px-4 py-3 font-medium h-full flex items-center">
                  Project Value : {projects[selectedProject].value}
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8  text-sm px-2 mt-4">
              <div className="space-y-1">

                <p className="flex items-center gap-2">
                  <FaUsers className="text-[#1f1f1f]" /> {/* Icon */}
                  <strong className="text-[#1f1f1f]">Associated PM :</strong>
                  {projects[selectedProject].pm}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-[#1f1f1f]" />
                  Timeline : {projects[selectedProject].timeline}
                </p>
              </div>

              <div className="space-y-1 text-left">
                <strong>
                  <p>Payment done : {projects[selectedProject].paymentDone}</p>
                </strong>
                <p className="text-[#C05E38] font-medium">Outstanding : {projects[selectedProject].outstanding}</p>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-[#4B1916] text-white text-center py-3 font-medium rounded-md">
              Your Project Progress & dedicated team members working on it!
            </div>

            {/* Timeline Component */}
            <div className="w-full mt-10 mb-10">
              <TimelinePhases />
            </div>
          </div>

          {/* Right Calendar Panel */}
          <div>
            <ProjectCalendar />
          </div>
        </div>

        {/* Trending Section */}
        <div className="mt-10">
          <TrendingCarousel />
        </div>
      </div>

      {/* Footer Full Width */}
      <div className="w-full">
        <Footer />
      </div>
    </>
  );
};

export default Dasone;