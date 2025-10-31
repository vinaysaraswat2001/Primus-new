import React, { useState, useEffect } from 'react';
import bgImageds from "../../assets/bgImageds.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProjects,
    setSelectedProject,
    selectSelectedProjectData,
    fetchProjectDetails,
    selectProjectList,
} from "../../redux/projectSlice";
import ProjectInfoBox from '../dasscreens/ProjectInfoBox';
import ProjectPhase from '../dasscreens/ProjectPhase';
import PaymentsOverview from '../dasscreens/PaymentsOverview';
import PaymentDetails from '../dasscreens/PaymentDetails';
import { IoMdDownload } from "react-icons/io";
import spinner from '../../assets/Spinner.png';
import check from '../../assets/Check.png';

function ProjectOverview() {
    const dispatch = useDispatch();

    const projects = useSelector(selectProjectList);
    const selectedProjectId = useSelector((s) => s.project.selectedId);
    const projectsStatus = useSelector((s) => s.project.status);
    const clientName = useSelector((s) => s.project.client_name);
    const projectData = useSelector(selectSelectedProjectData);
    const clientType = useSelector((s) => s.project.clientType);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDropdownProject, setSelectedDropdownProject] = useState("");
    const [statusFilter, setStatusFilter] = useState("Active"); // ✅ default filter
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);


    // Fetch projects on mount if idle
    useEffect(() => {
        if (projectsStatus === "idle") {
            dispatch(fetchProjects());
        }
    }, [dispatch, projectsStatus]);

    // When Redux projectId changes, update dropdown selection
    useEffect(() => {
        if (selectedProjectId) {
            setSelectedDropdownProject(selectedProjectId);
        }
    }, [selectedProjectId]);

    // ✅ Filter projects based on selected status
    const filteredProjects = projects.filter((p) => {
        const status = p.status?.toLowerCase();
        if (statusFilter === "Completed") return status === "completed";
        return status !== "completed"; // everything else counts as Active
    });


    // ✅ Auto-select first filtered project if none selected
    useEffect(() => {
        if (filteredProjects.length > 0 && !selectedDropdownProject) {
            const first = filteredProjects[0];
            dispatch(setSelectedProject(first.project_id));
            dispatch(fetchProjectDetails(first.project_id));
            setSelectedDropdownProject(first.project_id);
        }
    }, [filteredProjects, selectedDropdownProject, dispatch]);

    const selectedProjectName =
        filteredProjects.find((p) => p.project_id === selectedDropdownProject)?.project_name ||
        "Select Project";

    return (
        <div
            className="min-h-screen px-4 sm:px-8 py-6 -mt-[5rem] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImageds})` }}
        >
            {/* 🔹 Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-27">
                <div className="text-[#102437] font-semibold text-[26px]">
                    Welcome back, <span className="font-bold">{clientName || "User"}</span>
                </div>

                {/* 🔹 Filters and Dropdown */}
                <div className="flex justify-center items-center gap-5">
                    {/* Status Filter */}
                    {/* <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setSelectedDropdownProject(""); // clear project selection when filter changes
                            }}
                            className="h-10 px-4 rounded-3xl border text-sm text-[#667085] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div> */}

                    <div className="relative">
                        {/* Clickable Button */}
                        <div
                            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                            className="flex items-center justify-between w-40 h-10 px-2 py-2  rounded-3xl cursor-pointer text-sm text-[#667085]"
                        >
                            {statusFilter === "Completed" ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-white text-left text-sm font-medium px-8 py-2 bg-[#24C041] rounded-full">
                                        <img src={check} alt="Completed" className="w-3 h-3" />
                                        Completed
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-white text-left text-sm font-medium px-8 py-2 bg-[#FFB240] rounded-full">
                                        <img src={spinner} alt="Active" className="w-4 h-4" />
                                        Active
                                    </div>
                                </div>
                            )}
                            <svg
                                className={`w-4 h-5 transition-transform duration-200 ${statusDropdownOpen ? "rotate-180" : ""
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Dropdown List */}
                        {statusDropdownOpen && (
                            <div className="absolute fadeintop mt-2 rounded-xl py-2 px-2 flex flex-col bg-white w-full shadow-md z-50">
                                <div
                                    onClick={() => {
                                        setStatusFilter("Active");
                                        setSelectedDropdownProject("");
                                        setStatusDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >

                                    <span className="text-gray-800 text-sm"> Active </span>                      {/* <span className="text-gray-400 text-xs capitalize">{proj.status}</span> */}

                                </div>

                                <div
                                    onClick={() => {
                                        setStatusFilter("Completed");
                                        setSelectedDropdownProject("");
                                        setStatusDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <span className="text-gray-800 text-sm"> Completed </span>                      {/* <span className="text-gray-400 text-xs capitalize">{proj.status}</span> */}

                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white py-[0.4rem] px-8 border border-gray-300 rounded-3xl">
                        <p className="text-gray-700 font-medium">
                            {clientType ? clientType : "—"}
                        </p>
                    </div>


                    {/* Project Dropdown */}
                    <div className="relative w-full sm:w-72">
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-between w-full h-10 pl-3 pr-4 py-1 rounded-3xl bg-white border text-sm text-[#667085] cursor-pointer"
                        >
                            <span>{selectedProjectName}</span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {isDropdownOpen && (
                            <div
                                className="absolute fadeintop ml-[-4px] mt-2 rounded-xl py-3 px-2 flex flex-col bg-white w-full shadow-md z-100 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            >
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((proj) => (
                                        <div
                                            key={proj.project_id}
                                            onClick={() => {
                                                setSelectedDropdownProject(proj.project_id);
                                                dispatch(setSelectedProject(proj.project_id));
                                                dispatch(fetchProjectDetails(proj.project_id));
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex flex-col cursor-pointer px-3 rounded-xl py-2 hover:bg-gray-100"
                                        >
                                            <span className="text-gray-800 text-sm"> {proj.project_name || "Primus Project"} </span>                      {/* <span className="text-gray-400 text-xs capitalize">{proj.status}</span> */}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 text-sm py-2">
                                        No {statusFilter.toLowerCase()} projects found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔹 Dashboard sections */}
            <div className="flex flex-col justify-center items-center">
                <div className="grid grid-cols-[1fr_3fr] gap-6 items-stretch mt-8 mb-4">
                    <div className="h-full">
                        <ProjectInfoBox />
                    </div>
                    <div className="h-full">
                        <ProjectPhase />
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_3fr] gap-6 items-stretch">
                    <div className="h-full">
                        <PaymentsOverview />
                    </div>
                    <div className="h-full">
                        <PaymentDetails />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectOverview;
