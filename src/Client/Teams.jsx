import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaLinkedin, FaTwitter, FaFacebook, FaSearch } from "react-icons/fa";

import dummyprofile from "../assets/profile1.png";
import bgImageds from "../assets/bgImageds.jpg";


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
