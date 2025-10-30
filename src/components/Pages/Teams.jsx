// // src/components/dashboard/Team.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaSearch } from "react-icons/fa";
// import {
//   fetchTeamMembersOnly,
//   selectTeamByProject,
//   selectTeamStatusByProject,
//   selectTeamErrorByProject,
// } from "../../redux/teamSlice";
// import {
//   selectSelectedProjectId,
//   selectProjectList,
//   setSelectedProject,
//   fetchProjectDetails,
// } from "../../redux/projectSlice"; // ✅ added missing imports

// import dummyprofile from "../../assets/profile1.png";
// import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
// import bgImageds from "../../assets/bgImageds.jpg";

// const Team = () => {
//   const dispatch = useDispatch();

//   const projects = useSelector(selectProjectList);
//   const selectedProjectId = useSelector(selectSelectedProjectId);

//   const teamData = useSelector(selectTeamByProject(selectedProjectId)) || {};
//   const rawMembers = teamData.members || [];

//   const status = useSelector(selectTeamStatusByProject(selectedProjectId));
//   const error = useSelector(selectTeamErrorByProject(selectedProjectId));

//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedDropdownProject, setSelectedDropdownProject] = useState(
//     selectedProjectId || ""
//   );
//   // ✅ Fetch when project changes
//   useEffect(() => {
//     if (selectedProjectId && (status === "idle" || status === "failed")) {
//       dispatch(fetchTeamMembersOnly(selectedProjectId));
//     }
//   }, [dispatch, selectedProjectId]);

//   useEffect(() => {
//     if (selectedProjectId) {
//       setSelectedDropdownProject(selectedProjectId);
//     }
//   }, [selectedProjectId]);


//   // ✅ Filter logic (includes all known keys + null-safe)
//   const filteredMembers = useMemo(() => {
//     if (!Array.isArray(rawMembers) || rawMembers.length === 0) return [];

//     const q = searchQuery.trim().toLowerCase();
//     if (!q) return rawMembers;

//     const searchableKeys = [
//       "name",
//       "member_name",
//       "type",
//       "address",
//       "job_title",
//       "post_code",
//       "position",
//       "resource",
//       "member_id",
//       "user_id",
//     ];

//     return rawMembers.filter((m) =>
//       searchableKeys.some(
//         (key) => m[key] && String(m[key]).toLowerCase().includes(q)
//       )
//     );
//   }, [rawMembers, searchQuery]);

//   if (!selectedProjectId)
//     return (
//       <p className="text-center text-gray-600 py-6">
//         Select a project to see team members.
//       </p>
//     );

//   return (
//     <div className="bg-white p-6 rounded-2xl -mt-[5rem]"
//     style={{ backgroundImage: `url(${bgImageds})` }}
//     >
//       {/* Header + Search + Dropdown */}
//       <div className="mt-[5rem] flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-semibold text-gray-800">Project Team</h2>

//         <div className="flex items-center gap-4">
//           {/* Search input */}
//           <div className=" relative w-64">
//             <input
//               type="text"
//               placeholder="Search member..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-white w-full pl-9 pr-4 py-2 border rounded-full text-sm text-gray-700 focus:ring-[#91231A] focus:border-[#91231A]"
//             />
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//           </div>

//           {/* Project dropdown */}
//           <div className="relative w-64">
//             <div
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center justify-between w-full h-10 pl-3 pr-4 py-1 rounded-3xl bg-white border text-sm text-[#667085] cursor-pointer"
//             >
//               <span>
//                 {selectedDropdownProject
//                   ? projects.find((p) => p.project_id === selectedDropdownProject)?.project_name || "Unnamed Project"
//                   : "Select Project"}
//               </span>

//               <svg
//                 className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
//                   }`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>

//             {isDropdownOpen && (
//               <div className="absolute fadeintop ml-[-4px] mt-2 rounded-xl py-3 px-2 flex flex-col bg-white w-full shadow-md z-100 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                 {projects.map((proj) => (
//                   <div
//                     key={proj.project_id}
//                     onClick={() => {
//                       setSelectedDropdownProject(proj.project_id);
//                       dispatch(setSelectedProject(proj.project_id));
//                       dispatch(fetchProjectDetails(proj.project_id));
//                       setIsDropdownOpen(false);
//                     }}
//                     className="flex items-center justify-between cursor-pointer px-3 rounded-xl py-1 hover:bg-gray-100"
//                   >
//                     <span className="text-gray-800 text-sm">
//                       {proj.project_name || "Unnamed Project"}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Status states */}
//       {status === "loading" ? (
//         <p className="text-center text-gray-500 py-8">
//           Loading team members...
//         </p>
//       ) : error ? (
//         <p className="text-center text-red-600 py-8">{error}</p>
//       ) : filteredMembers.length === 0 ? (
//         <p className="text-center text-gray-500 py-8">No members found.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 px-8 pb-8">
//           <p className="text-[#91231A] text-[25px] font-semibold mt-10 mb-5">
//             Meet your On-site Team members
//           </p>

//           <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
//             {filteredMembers.map((m, i) => (
//               <div
//                 key={i}
//                 className="bg-white shadow rounded-lg overflow-hidden border border-gray-100"
//               >
//                 <img
//                   src={dummyprofile}
//                   alt={m.name || "Team Member"}
//                   className="w-full h-45 object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     {m.name || "N/A"}
//                   </h3>
//                   <p className="text-sm text-[#91231A] font-semibold mb-2">
//                     {m.job_title || "N/A"}
//                   </p>
//                   <div className="text-sm text-gray-700 space-y-1 mb-4">
//                     <p>
//                       <span className="font-medium">Member Name:</span>{" "}
//                       {m.member_name || "N/A"}
//                     </p>
//                     <p>
//                       <span className="font-medium">Position:</span>{" "}
//                       {m.position || "N/A"}
//                     </p>
//                     <p>
//                       <span className="font-medium">Address:</span>{" "}
//                       {m.address || "N/A"}
//                     </p>
//                     <p>
//                       <span className="font-medium">Post Code:</span>{" "}
//                       {m.post_code || "N/A"}
//                     </p>
//                     <p>
//                       <span className="font-medium">Resource:</span>{" "}
//                       {m.resource || "N/A"}
//                     </p>
//                   </div>
//                   <div className="flex gap-2 text-gray-600 text-lg">
//                     <a href="#" aria-label="LinkedIn">
//                       <FaLinkedin />
//                     </a>
//                     <a href="#" aria-label="Twitter">
//                       <FaTwitter />
//                     </a>
//                     <a href="#" aria-label="Facebook">
//                       <FaFacebook />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Team;


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaLinkedin, FaTwitter, FaFacebook, FaSearch } from "react-icons/fa";

import dummyprofile from "../../assets/profile1.png";
import bgImageds from "../../assets/bgImageds.jpg";

// import {
//   fetchTeamMembers,
//   selectTeamByProject,
//   selectTeamStatusByProject,
//   selectTeamErrorByProject,
// } from "../../redux/teamSlice";

// import { selectSelectedProjectId } from "../../redux/projectSlice";

const allMembers = [
  {
    name: "Vinay Saraswat",
    designation: "Data Scientist",
    bio: "Develops and optimizes backend systems ensuring scalability and performance."
  },
  {
    name: "Harsh Bhardwaj",
    designation: "Frontend Developer",
    bio: "Specializes in creating responsive and user-friendly web interfaces using React."
  },
  {
    name: "Shivam Gupta",
    designation: "Backend Developer",
    bio: "Builds RESTful APIs, manages databases, and handles server-side logic."
  },
  {
    name: "Rafik Mohammad ",
    designation: "UI/UX Designer",
    bio: "Designs clean and intuitive user experiences, focusing on usability and aesthetics."
  },
  {
    name: "Garvit Dang",
    designation: "DevOps Engineer",
    bio: "Automates deployment pipelines and maintains cloud infrastructure for reliability."
  },
  {
    name: "Sneha Patel",
    designation: "Full Stack Developer",
    bio: "Works across frontend and backend to build seamless end-to-end web applications."
  },
  {
    name: "Arjun Mehta",
    designation: "Machine Learning Engineer",
    bio: "Builds and deploys ML models, optimizing algorithms for performance and accuracy."
  },
  {
    name: "Pooja Iyer",
    designation: "Software QA Engineer",
    bio: "Ensures software reliability through automated testing and quality assurance processes."
  },
];

const Teams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const selectedProjectId = useSelector(selectSelectedProjectId);

  // const { members: rawMembers, projectName } = useSelector(selectTeamByProject(selectedProjectId));
  // const status = useSelector(selectTeamStatusByProject(selectedProjectId));
  // const error = useSelector(selectTeamErrorByProject(selectedProjectId));

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch members only if not already loaded
  // useEffect(() => {
  //   if (selectedProjectId && status === "idle") {
  //     dispatch(fetchTeamMembers(selectedProjectId));
  //   }
  // }, [selectedProjectId, status, dispatch]);

  // Filter members dynamically
  // Filter members dynamically
const filteredMembers = useMemo(() => {
  if (!allMembers) return [];
  const q = searchQuery.trim().toLowerCase();
  if (!q) return allMembers;
  
  return allMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      (m.designation && m.designation.toLowerCase().includes(q)) ||
      (m.bio && m.bio.toLowerCase().includes(q))
  );
}, [searchQuery]);


  // Group by category (like On-site, Off-site, etc.)
  const groupedMembers = useMemo(() => {
    if (!filteredMembers) return {};
    return filteredMembers.reduce((acc, member) => {
      const cat = member.category || "Others";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(member);
      return acc;
    }, {});
  }, [filteredMembers]);

  // UI when no project is selected
  // if (!selectedProjectId) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <p className="text-gray-600 text-lg">
  //         Please select a project to view its team members.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div
      className="min-h-screen px-4 sm:px-8 py-6 -mt-[5rem] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-[5rem]">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Team
        </h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black placeholder-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-7 rounded-4xl">
        {status === "loading" ? (
          // Loading Skeleton
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center text-center animate-pulse"
              >
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) 
        // : error ? (
        //   <p className="text-center text-red-600 py-10">ERROR</p>
        // ) 
        : filteredMembers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No team members found.</p>
        ) : (
          Object.entries(groupedMembers).map(([category, members]) => (
            <div key={category} className="mb-12">
              <p className="text-[#91231A] text-[25px] font-semibold mb-5">
                {/* Meet your {category} Team members */}
                Meet your On-site Team members
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {members.map((member) => (
                  <div
                    key={member.memberID}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <img
                      src={member.profileImage || dummyprofile}
                      alt={member.memberName}
                      className="w-full h-60 object-cover"
                    />

                    <div className="p-4 text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-red-600 font-medium mb-2">
                        {member.designation}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Responsible for your overall project delivery and
                        statistics. Feel free to reach out for updates on your
                        project.
                      </p>
                      <div className="flex items-center gap-4 ">
                                                    <FaLinkedin className="cursor-pointer h-5 w-5"/><FaTwitter className="cursor-pointer h-5 w-5"/><FaFacebook className="cursor-pointer h-5 w-5"/>
                      </div>

                      {/* Social Links */}
                      {/* <div className="flex gap-3 text-gray-700">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FaLinkedin />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FaTwitter />
                          </a>
                        )}
                        {member.facebook && (
                          <a
                            href={member.facebook}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FaFacebook />
                          </a>
                        )}
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teams;
