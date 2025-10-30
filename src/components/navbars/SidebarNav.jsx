import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaFileAlt,
  FaCommentDots,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaTimes,
} from "react-icons/fa";

const SidebarNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ default open
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const getLinkClass = (path) =>
    `flex items-center gap-3 whitespace-nowrap cursor-pointer font-semibold transition duration-200 ${activePath === path ? "text-white underline" : "text-white no-underline"
    }`;

  return (
    <div
      className={`bg-[#441410] text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
        } hidden md:block relative`}
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
    >
      {/* Close icon when expanded */}
      {sidebarOpen && (
        <div className="p-3 flex justify-end">
          <button
            className="text-white opacity-60 hover:opacity-100 transition"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes size={16} />
          </button>
        </div>
      )}

      <div className="p-5 space-y-6 overflow-hidden">
        <div
          className={getLinkClass("/dashboard/project-reachout")}
          onClick={() => handleNavigation("/dashboard/project-reachout")}
        >
          <FaProjectDiagram size={20} />
          {sidebarOpen && <span>Project Reach Out</span>}
        </div>

        <div
          className={getLinkClass("/dashboard/know-your-team")}
          onClick={() => handleNavigation("/dashboard/know-your-team")}
        >
          <FaUsers size={20} />
          {sidebarOpen && <span>Know Your Team</span>}
        </div>

        <div
          className={getLinkClass("/dashboard/document-library")}
          onClick={() => handleNavigation("/dashboard/document-library")}
        >
          <FaFileAlt size={20} />
          {sidebarOpen && <span>Document Library</span>}
        </div>

        <div
          className={getLinkClass("/dashboard/feedback")}
          onClick={() => handleNavigation("/dashboard/feedback")}
        >
          <FaCommentDots size={20} />
          {sidebarOpen && <span>Feedback</span>}
        </div>

        <div
          className={getLinkClass("/dashboard/project-issue-alert")}
          onClick={() => handleNavigation("/dashboard/project-issue-alert")}
        >
          <FaExclamationTriangle size={20} />
          {sidebarOpen && <span>Project Issue Alert</span>}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;  