import React, { useEffect } from "react";
import profile from '../../assets/teamProfile.png'
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectDetails,
  selectSelectedProjectData,
  selectSelectedProjectId,
  selectStatusById,
  selectErrorById,
} from "../../redux/projectSlice";
 
const ProjectInfoBox = () => {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const projectData = useSelector(selectSelectedProjectData);
  const status = useSelector(selectStatusById(selectedProjectId));
  const error = useSelector(selectErrorById(selectedProjectId));
 
  useEffect(() => {
    if (selectedProjectId && !projectData && status !== "loading") {
      dispatch(fetchProjectDetails(selectedProjectId));
    }
  }, [selectedProjectId, projectData, status, dispatch]);
 
  if (!selectedProjectId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md mx-auto text-center">
        Select a project to view details.
      </div>
    );
  }
 
if (status === "loading" || !projectData) {
    return (
      // <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md mx-auto animate-pulse">
      //   <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      //   <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      //   <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      // </div>
      <div className="flex min-h-[59vh] w-[30vw] bg-white rounded-4xl justify-center items-center h-full">
            <p className="text-gray-500 text-lg font-medium animate-pulse">Loading...</p>
        </div>
    );
  }
 
  if (status === "failed") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md mx-auto text-red-600">
        Failed to load project details: {error}
      </div>
    );
  }
 
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto space-y-5">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-900">Project Information</h2>
      {/* Project Title */}
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Project Title:</span>
        <span className="text-gray-900 font-semibold text-right">
          {projectData.description} ({projectData.projectNo})
        </span>
      </div>
 
      {/* Assigned To */}
      <div className="flex justify-between items-center ">
        <span className="text-gray-500 font-medium">Assigned to:</span>
        <div className="flex items-center gap-3 mt-2">
          <img
            src={profile}// replace with dynamic if available
            alt="Assigned user"
            className="w-11 h-10 border-2 border-gray-200 rounded-full"
          />
          <div>
            <p className="text-gray-900 font-medium">
                {projectData.projectManagerPrimus?.trim() ? projectData.projectManagerPrimus : "NA"}
 
            </p>
          </div>
        </div>
      </div>
 
      {/* Start Date */}
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">Start Date:</span>
        <span className="text-gray-900">{projectData.startingDate}</span>
      </div>
 
      {/* Status */}
      <div className="flex justify-between items-center">
        <span className="text-gray-500 font-medium">Status:</span>
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border ${
            projectData.status?.toLowerCase() === "open"
              ? "bg-orange-50 text-orange-600 border-orange-200"
              : projectData.status?.toLowerCase() === "completed"
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current"></span>
          {projectData.status || "Unknown"}
        </span>
      </div>
 
      {/* Team Members */}
      <div className="flex items-center justify-between">
  <span className="text-gray-500 font-medium">Team Members:</span>
  <div className="flex items-center ml-3">
    {projectData.members && projectData.members.length > 0 ? (
      <>
        {projectData.members.slice(0, 3).map((member, i) => (
          <img
            key={i}
            src={member.image || profile}
            alt={member.memberName}
            className={`w-8 h-8 rounded-full border-2 border-gray-200 ${
              i !== 0 ? "-ml-3" : ""
            }`}
          />
        ))}
        {projectData.members.length > 3 && (
          <div className="-ml-3 w-12 h-8 flex items-center justify-center rounded-full bg-[#F8B26A] text-white text-[11px] font-semibold border-2 border-white">
            +{projectData.members.length - 3}
          </div>
        )}
      </>
    ) : (
      <span className="text-gray-400 text-sm">Not Available</span>
    )}
  </div>
</div>
 
    </div>
  );
};
 
export default ProjectInfoBox;
 
 