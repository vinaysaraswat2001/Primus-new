import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectSelectedProjectData, selectSelectedProjectId } from "../../redux/projectSlice";

const FeedbackAttachmentsPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redux selectors
  console.log("FeedbackAttachmentsPage rendered");
  const userEmail = useSelector((state) => state.user.email);
  const authToken = localStorage.getItem("authToken");
  console.log("User Email from Redux:", userEmail);
  console.log("Auth Token from Redux:", authToken);
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedProjectData = useSelector(selectSelectedProjectData);

  const projectNo = selectedProjectData?.projectNo;
  console.log(projectNo)

  useEffect(() => {
    const fetchFeedbackData = async () => {
      if (!userEmail || !projectNo) return;

      setLoading(true);
      setError(null);

      try {
     const response = await axios.post(
  "http://127.0.0.1:8000/client/get-feedback",
  { client_email: userEmail, project_no: projectNo },
  {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }
);


        if (response.data?.items) {
          setFeedbackData(response.data.items);
        } else {
          setFeedbackData([]);
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback attachments.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [userEmail, projectNo]);

  if (!projectNo) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        Please select a project to view feedback attachments.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        Loading feedback attachments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
        {error}
      </div>
    );
  }

  if (feedbackData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        No feedback attachments available for this project.
      </div>
    );
  }

  // Helper: Render attachment section
  const renderAttachments = (attachments, title) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      {attachments && attachments.length > 0 ? (
        <ul className="space-y-2">
          {attachments.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-3 transition-all"
            >
              <span className="text-gray-700 font-medium truncate">{file.filename}</span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                View / Download
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No attachments available.</p>
      )}
    </div>
  );

  // return (
  //   <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-8 mx-auto max-w-4xl space-y-8">
  //     <h2 className="text-2xl font-bold text-gray-900 mb-6">
  //       Feedback Attachments for Project:{" "}
  //       <span className="text-indigo-600">{selectedProjectData?.description} ({projectNo})</span>
  //     </h2>

  //     {feedbackData.map((item, index) => (
  //       <div
  //         key={item._id || index}
  //         className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 shadow-sm"
  //       >
  //         <div className="mb-4">
  //           <h3 className="text-xl font-semibold text-gray-800">
  //             {item.project_name || "Unnamed Project"}
  //           </h3>
  //           <p className="text-gray-500 text-sm">
  //             Submitted on: {new Date(item.created_at).toLocaleDateString()} | Category:{" "}
  //             <span className="capitalize">{item.category.replaceAll("_", " ")}</span>
  //           </p>
  //         </div>

  //         {/* Attachments Section */}
  //         {renderAttachments(item.feedback_attachments_appreciation_letter, "Appreciation Letters")}
  //         {renderAttachments(item.feedback_attachments_completion_certificate, "Completion Certificates")}
  //         {renderAttachments(item.feedback_attachments_experience_letter, "Experience Letters")}
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
  <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-8 mx-auto max-w-4xl h-[80vh] overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">
      Feedback Attachments for Project:{" "}
      <span className="text-indigo-600">
        {selectedProjectData?.description} ({projectNo})
      </span>
    </h2>

    {feedbackData.map((item, index) => (
      <div
        key={item._id || index}
        className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 shadow-sm"
      >
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {item.project_name || "Unnamed Project"}
          </h3>
          <p className="text-gray-500 text-sm">
            Submitted on: {new Date(item.created_at).toLocaleDateString()} | Category:{" "}
            <span className="capitalize">{item.category.replaceAll("_", " ")}</span>
          </p>
        </div>

        {/* Attachments Section */}
        {renderAttachments(
          item.feedback_attachments_appreciation_letter,
          "Appreciation Letters"
        )}
        {renderAttachments(
          item.feedback_attachments_completion_certificate,
          "Completion Certificates"
        )}
        {renderAttachments(
          item.feedback_attachments_experience_letter,
          "Experience Letters"
        )}
      </div>
    ))}
  </div>
);

};

export default FeedbackAttachmentsPage;
