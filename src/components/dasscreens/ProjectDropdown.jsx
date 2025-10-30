import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, setSelectedProject, fetchProjectDetails } from "../../redux/projectSlice";
import portfolio from "../../assets/portfolio.png";
import schedule from "../../assets/schedule.png";
import critical from "../../assets/critical.png";
import completedProject from '../../assets/completedProject.png'
import ActiveProjectfrom from '../../assets/ActiveProject.png';
import TotalProject from '../../assets/TotalProject.png'


const ProjectDropdown = ({ onProjectSelect }) => {
  const dispatch = useDispatch();

  // Redux state
  const projects = useSelector((s) => s.project.projects);
  const selectedProjectId = useSelector((s) => s.project.selectedId);
  const projectsStatus = useSelector((s) => s.project.status);
  const clientName = useSelector((s) => s.project.client_name);

  function formatIndianAmount(num) {
    if (num === null || num === undefined) return "0";

    const n = Number(num);
    if (isNaN(n)) return num;

    if (n >= 10000000) {
      return (n / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
    } else if (n >= 100000) {
      return (n / 100000).toFixed(2).replace(/\.00$/, "") + " L";
    } else if (n >= 1000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, "") + " K";
    } else {
      return n.toString();
    }
  }



  const totals = {
    total: useSelector((s) => s.project.total_projects),
    ongoing: useSelector((s) => s.project.ongoing_projects),
    completed_projects: useSelector((s) => s.project.completed_projects),
    budget: useSelector((s) => s.project.totalOverallProjectValue)

  };
  console.log(totals)
  const [open, setOpen] = useState(false);
  const selectedProject = projects.find((p) => p.project_id === selectedProjectId);

  // Fetch projects on mount if idle
  useEffect(() => {
    if (projectsStatus === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, projectsStatus]);

  // Auto-select first project if none selected
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      const first = projects[0];
      dispatch(setSelectedProject(first.project_id));
      dispatch(fetchProjectDetails(first.project_id));
      onProjectSelect?.(first);
    }
  }, [projects, selectedProjectId, dispatch, onProjectSelect]);

  const handleSelect = (project) => {
    dispatch(setSelectedProject(project.project_id));
    dispatch(fetchProjectDetails(project.project_id));
    onProjectSelect?.(project);
    setOpen(false);
  };

  if (projectsStatus === "loading") {
    return (
      <div className="inline-flex items-center px-4 py-2 font-medium rounded-xl shadow-sm bg-white text-gray-700">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="container ml-[0.5rem]">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
        <div className="">
          <p className="bg-[#00BA6D] text-white rounded-2xl px-3 py-1 text-xs inline">HealthCare</p>
          <p className="text-[#102437] font-semibold text-[26px]"> Welcome back, <span className="font-bold">{clientName || "User"}</span></p>
        </div>

        {/* Stats cards container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">

          {/* Total Projects */}
          <div className="bg-white rounded-2xl px-4 flex items-center justify-between shadow-sm h-30">
            <div>
              <p className="text-[#202224] font-medium text-base">Total Projects</p>
              <p className="mt-2 text-black font-bold text-2xl">{totals.total ?? 0}</p>
            </div>
            <div className=" p-4 rounded-full flex items-center justify-center">
              <img src={TotalProject} alt="Projects Portfolio" className="w-14 h-14 object-contain" />
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-2xl px-4 flex items-center justify-between shadow-sm h-30">
            <div>
              <p className="text-[#202224] font-medium text-base">Active Projects</p>
              <p className="mt-2 text-black font-bold text-2xl">{totals.ongoing ?? 0}</p>
            </div>
            <div className=" p-4 rounded-full flex items-center justify-center">
              <img src={ActiveProjectfrom} alt="On Schedule" className="w-14 h-14 object-contain" />
            </div>
          </div>

          {/* Completed Projects */}
          <div className="bg-white rounded-2xl px-4 flex items-center justify-between shadow-sm h-30">
            <div>
              <p className="text-[#202224] font-medium text-base">Completed Projects</p>
              <p className="mt-2 text-black font-bold text-2xl">{totals.completed_projects ?? 0}</p>
            </div>
            <div className=" p-4 rounded-full flex items-center justify-center">
              <img src={completedProject} alt="Completed Projects" className="w-14 h-14 object-contain" />
            </div>
          </div>

          {/* Total Budget */}
          <div className="bg-white rounded-2xl px-4 flex items-center justify-between shadow-sm h-30">
            <div>
              <p className="text-[#202224] font-medium text-base">Total Budget [INR]</p>
              <p className="mt-2 text-black font-bold text-2xl">  {formatIndianAmount(totals.budget)}</p>
            </div>
            <div className=" p-4 rounded-full flex items-center justify-center">
              <img src={schedule} alt="Budget" className="w-14 h-14 object-contain" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectDropdown;
