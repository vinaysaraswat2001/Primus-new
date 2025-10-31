
// src/components/dashboard/Dashboard.jsx
import React, { useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import Publications from "../Pages/Publications";
import ProjectDropdown from "./ProjectDropdown";
import ProjectInfoBox from "./ProjectInfoBox";
import TimelinePhases from "./TimelinePhases";
import TeamMeetings from "./TeamMeetings";
import TaskBoard from "./TaskBoard";
import TrendingCarousel from "./TrendingCarousel";
// import Footer from "../navbars/Footer/Footer";
import bgImageds from "../../assets/bgImageds.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  fetchProjectDetails,
  selectSelectedProjectId,
  selectSelectedProjectData,
} from "../../redux/projectSlice";
import PublicationDashBoard from "./PublicationDashBoard";


const Dashboard = () => {
  const dispatch = useDispatch();

  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedProject = useSelector(selectSelectedProjectData);
  const clientName = useSelector((s) => s.project.client_name);
  const projectsStatus = useSelector((s) => s.project.status);

  // Fetch projects on mount
  useEffect(() => {
    if (projectsStatus === "idle") {
      console.debug("[Dashboard] dispatching fetchProjects...");
      dispatch(fetchProjects());
    }
  }, [dispatch, projectsStatus]);

  // Fetch project details whenever selectedId changes
  useEffect(() => {
    if (selectedProjectId) {
      console.debug("[Dashboard] fetching details for project:", selectedProjectId);
      dispatch(fetchProjectDetails(selectedProjectId));
    }
  }, [dispatch, selectedProjectId]);

  return (
    <>
      <div
        className="lg:col-span-2 space-y-6 p-6 mt-0.1 bg-cover bg-center bg-no-repeat -mt-[5rem]"
        style={{ backgroundImage: `url(${bgImageds})` }}
      >
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between  items-center mb-6 gap-4 mt-[5rem]">
  
             <ProjectDropdown />
           </div>

        <PublicationDashBoard></PublicationDashBoard>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
