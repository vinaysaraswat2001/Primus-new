import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImageds from "./bgImageds.jpg";
import AdvisoryProjectDropdown from "./AdvisoryProjectDropdown";
import AdvisoryTeamMeetings from "./AdvisoryTeamMeetings";
import AdvisoryPendingTasks from "./AdvisoryPendingTasks";
import AdvisoryNewsUpdates from "./AdvisoryNewsUpdates.jsx";


const AdvisoryDashboard = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div
      className="lg:col-span-2 space-y-6 p-6 mt-0.1 bg-cover bg-center bg-no-repeat -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="mt-[5rem]">
        {/* Project Selection */}
        <div className="mb-6">
          <AdvisoryProjectDropdown />
        </div>

        {/* Dashboard Components Placeholder */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 space-y-6">
            <AdvisoryTeamMeetings />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <AdvisoryPendingTasks />
          </div>
        </div>

        <div className="">
          <AdvisoryNewsUpdates />
        </div>
      </div>
    </div>
  );
};

export default AdvisoryDashboard;