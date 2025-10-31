import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImageds from "./bgImageds.jpg";
import JobPortal from "./JobPortal"
import AlumniProjectDropdown from "./AlumniProjectDropdown";
import CommunityConnections from "./CommunityConnections"
import Event from "./Event"
import AlumniCommunityNewsFeed from "./AlumniCommunityNewsFeed"
// import AdvisoryTeamMeetings from "./AdvisoryTeamMeetings";
// import AdvisoryPendingTasks from "./AdvisoryPendingTasks";
// import AdvisoryNewsUpdates from "./AdvisoryNewsUpdates.jsx";


const AdvisoryDashboard = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div
      className="lg:col-span-2 space-y-6 p-6 mt-0.1 overflow-y-auto bg-cover bg-center bg-no-repeat -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="mt-[5rem]">
        {/* Project Selection */}
        <div>
          <AlumniProjectDropdown />
        </div>

        {/* Dashboard Components Placeholder */}
        <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full md:w-1/2 flex flex-col gap-1">
            <Event limit={1} minimal />
            <JobPortal minimal />
          </div>


          {/* Right column: Community Connections & News Feed */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <CommunityConnections />
            <AlumniCommunityNewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisoryDashboard;