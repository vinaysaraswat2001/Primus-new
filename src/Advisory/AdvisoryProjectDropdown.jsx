import React, { useState, useEffect } from "react";
import schedule from "../assets/schedule.png";
import completedProject from "../assets/completedProject.png";
import ActiveProjectfrom from "../assets/ActiveProject.png";
import TotalProject from "../assets/TotalProject.png";

// Mock projects data
const MOCK_PROJECTS = [
  { project_id: 1, name: "Project A" },
  { project_id: 2, name: "Project B" },
  { project_id: 3, name: "Project C" },
];

const AdvisoryProjectDropdown = ({ onProjectSelect, clientName = "User" }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [totals, setTotals] = useState({
    total: 0,
    ongoing: 0,
    completed_projects: 0,
    budget: 0,
  });
  const [loading, setLoading] = useState(true);

  // Format numbers in Indian style
  const formatIndianAmount = (num) => {
    if (num === null || num === undefined) return "0";
    const n = Number(num);
    if (isNaN(n)) return num;
    if (n >= 10000000) return (n / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
    if (n >= 100000) return (n / 100000).toFixed(2).replace(/\.00$/, "") + " L";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + " K";
    return n.toString();
  };

  // Simulate fetching projects & totals
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProjects(MOCK_PROJECTS);

      // Example totals
      setTotals({
        total: 12,
        ongoing: 5,
        completed_projects: 7,
        budget: 12500000,
      });

      // Auto-select first project
      const first = MOCK_PROJECTS[0];
      setSelectedProjectId(first.project_id);
      onProjectSelect?.(first);

      setLoading(false);
    }, 500);
  }, [onProjectSelect]);

  const handleSelect = (project) => {
    setSelectedProjectId(project.project_id);
    onProjectSelect?.(project);
  };

  if (loading) {
    return (
      <div className="inline-flex items-center px-4 py-2 font-medium rounded-xl shadow-sm bg-white text-gray-700">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="container ml-[0.5rem]">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
        <div className="text-[#102437] font-semibold text-[26px]">
          Welcome back, <span className="font-bold">{clientName}</span>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Total Projects */}
          <StatCard title="Total Projects" value={totals.total} icon={TotalProject} />

          {/* Active Projects */}
          <StatCard title="Active Projects" value={totals.ongoing} icon={ActiveProjectfrom} />

          {/* Completed Projects */}
          <StatCard title="Completed Projects" value={totals.completed_projects} icon={completedProject} />

          {/* Total Budget */}
          {/* <StatCard title="Total Budget [INR]" value={formatIndianAmount(totals.budget)} icon={schedule} /> */}
        </div>
      </div>
    </div>
  );
};

// Reusable stats card component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl px-4 flex items-center justify-between shadow-sm h-30">
    <div>
      <p className="text-[#202224] font-medium text-base">{title}</p>
      <p className="mt-2 text-black font-bold text-2xl">{value}</p>
    </div>
    <div className="p-4 rounded-full flex items-center justify-center">
      <img src={icon} alt={title} className="w-14 h-14 object-contain" />
    </div>
  </div>
);

export default AdvisoryProjectDropdown;