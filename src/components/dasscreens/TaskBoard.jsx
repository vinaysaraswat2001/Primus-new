import React from "react";

const TaskBoard = () => {
  const tasks = [
    {
      title: "Finalize User Access Policies",
      status: "To do",
      priority: "High",
      progress: 40,
      description:
        "There are pending security configurations that define role-based access for end user...",
    },
    {
      title: "Client UAT Feedback Fixes",
      status: "In Progress",
      priority: "Medium",
      progress: 60,
      description:
        "There are pending security configurations that define role-based access for end user...",
    },
    {
      title: "Phase 2 Data Migration Completion",
      status: "Review",
      priority: "Low",
      progress: 70,
      description:
        "There are pending security configurations that define role-based access for end user...",
    },
    {
      title: "Vendor Module Integration Testing",
      status: "Completed",
      priority: "High",
      progress: 100,
      description:
        "There are pending security configurations that define role-based access for end user...",
    },
  ];

  const getBorderColor = (status) => {
    switch (status) {
      case "To do":
        return "border-blue-500";
      case "In Progress":
        return "border-cyan-500";
      case "Review":
        return "border-yellow-500";
      default:
        return "border-green-500";
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "To do":
        return "bg-blue-500";
      case "In Progress":
        return "bg-cyan-500";
      case "Review":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="bg-yellow-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">ERP Migration Task Board</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${getBorderColor(
              task.status
            )} flex flex-col justify-between min-h-[250px]`}  // 👈 ensures equal height & bottom alignment
          >
            {/* Top Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-sm font-semibold ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
                <span className="text-gray-500 text-sm">{task.status}</span>
              </div>

              <h3 className="text-lg font-bold mb-2">{task.title}</h3>
              <p className="text-gray-600 text-sm">{task.description}</p>
            </div>

            {/* Bottom Section – Progress */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${getProgressColor(
                    task.status
                  )} h-2.5 rounded-full`}
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">
                {task.progress}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;