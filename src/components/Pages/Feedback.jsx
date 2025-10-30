import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Star, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import bgImageds from "../../assets/bgImageds.jpg";
import FeedBackAttachmentsPage from "./FeedBackAttachmentsPage";
import { fetchTimeline } from "../../redux/projectTimelineSlice";
import {
  fetchProjects,
  fetchProjectDetails,
  setSelectedProject,
  selectProjectList,
  selectSelectedProjectId,
  selectTeamMembersOfSelectedProject,
} from "../../redux/projectSlice";

const categoriesList = [
  "Milestone Feedback",
  "Delivery & Timelines",
  "Communication",
  "Technical Expertise",
  "Support",
  "Documentation",
  "Team Professionalism",
  "Overall Experience",
  "Other"
];

const teamMembersList = [
  { id: "vinay saraswat", name: "Vinay Saraswat" ,designation: "Data Scientist"},
  { id: "Harsh Bhardwaj", name: "Harsh Bhardwaj", designation: "Frontend Developer" },
  { id: "Shivam Gupta", name: "Shivam Gupta" , designation: "Backend Developer" },
  { id: "Rafik Mohammad", name: "Rafik Mohammad", designation: "UI/UX Designer" },
  { id: "Garvit Dang", name: "Garvit Dang", designation: "DevOps Engineer" },
  { id: "Sneha Patel", name: "Sneha Patel", designation: "Full Stack Developer" },
  { id: "Arjun Mehta", name: "Arjun Mehta" , designation: "Machine Learning Engineer"},
  { id: "Pooja Iyer", name: "Pooja Iyer" , designation: "Software QA Engineer"},
];

const Dropdown = ({ value, options, isOpen, onToggle, onSelect, placeholder }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none"
    >
      <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {options?.length === 0 ? (
          <div className="px-4 py-3 text-gray-500">No options found</div>
        ) : (
          options.map((option, i) => (
            <button
              key={i}
              onClick={() => onSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              {typeof option === "object" ? option.memberName || option.project_name : option}
            </button>
          ))
        )}
      </div>
    )}
  </div>
);

const ShareFeedback = ({ onFeedbackSubmit }) => {
  const dispatch = useDispatch();

  const projects = useSelector(selectProjectList);
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const teamMembers = useSelector(selectTeamMembersOfSelectedProject);

  const [selectedProject, setSelectedProjectState] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modulesList, setModulesList] = useState([]);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");



  const [formData, setFormData] = useState({
    project: "",
    category: "",
    teamMember: "",
    overall_satisfaction: 0,
    communication_quality: 0,
    team_collaboration: 0,
    solution_quality: 0,
    feedback: "",
    file: null,
    milestone: "",
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentLibrary, setShowDocumentLibrary] = useState(false);

  const [files, setFiles] = useState({
    experience: null,
    appreciation: null,
    certificate: null,
  });

  // Initialize projects
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoadingProject(true);
      try {
        let list = projects;
        if (!list || list.length === 0) {
          const res = await dispatch(fetchProjects()).unwrap();
          list = res?.projects || [];
        }
        if (cancelled) return;

        const projectToSelect = selectedProjectId
          ? list.find((p) => p.project_id === selectedProjectId) || list[0]
          : list[0];

        setSelectedProjectState(projectToSelect);
        setFormData((prev) => ({ ...prev, project: projectToSelect?.project_name || "" }));
        dispatch(setSelectedProject(projectToSelect?.project_id));
      } catch (err) {
        console.error("Failed to initialize projects:", err);
        toast.error("Failed to load projects");
      } finally {
        if (!cancelled) setLoadingProject(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [dispatch, projects, selectedProjectId]);

  // Fetch project details for team members
  useEffect(() => {
    if (!selectedProject) return;
    dispatch(fetchProjectDetails(selectedProject.project_id))
      .unwrap()
      .then((details) => console.log("Project details fetched:", details))
      .catch((err) => console.error("Failed to fetch project details:", err));
  }, [selectedProject, dispatch]);

  const handleDropdownSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "category") setShowCategoryDropdown(false);
    if (field === "teamMember") setShowTeamDropdown(false);
  };

  const timeline = useSelector(
    (s) => s.timeline?.timelines?.[selectedProject?.project_id] ?? null
  );

  useEffect(() => {
    if (selectedProject?.project_id) {
      dispatch(fetchTimeline(selectedProject.project_id));
    }
  }, [dispatch, selectedProject]);

  useEffect(() => {
    if (timeline?.phases) {
      const modules = timeline.phases.map((phase) => ({
        name: phase.title,
        status: phase.status.toLowerCase(),
      }));
      setModulesList(modules);
    }
  }, [timeline]);



  const handleStarClick = (type, rating) => {
    let field;
    switch (type) {
      case "overall": field = "overall_satisfaction"; break;
      case "communication": field = "communication_quality"; break;
      case "collaboration": field = "team_collaboration"; break;
      case "solution": field = "solution_quality"; break;
      default: return;
    }
    setFormData((prev) => ({ ...prev, [field]: rating }));
  };

  const handleSubmit = async () => {
    if (
      !formData.category ||
      !selectedProject ||
      !formData.overall_satisfaction ||
      !formData.feedback.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    const formDataToSend = new FormData();

    formDataToSend.append("client_email", localStorage.getItem("Email"));
    formDataToSend.append("project_no", selectedProject.project_id);
    formDataToSend.append("project_name", selectedProject.project_name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("milestone_name", formData.milestone);
    formDataToSend.append("team_member_id", formData.teamMember || null);
    formDataToSend.append("communication_quality", formData.communication_quality);
    formDataToSend.append("team_collaboration", formData.team_collaboration);
    formDataToSend.append("solution_quality", formData.solution_quality);
    formDataToSend.append("overall_satisfaction", formData.overall_satisfaction);
    formDataToSend.append("comments", formData.feedback);

    if (files.experience) formDataToSend.append("feedback_attachments_experience_letter", files.experience);
    if (files.appreciation) formDataToSend.append("feedback_attachments_appreciation_letter", files.appreciation);
    if (files.certificate) formDataToSend.append("feedback_attachments_completion_certificate", files.certificate);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/client/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Feedback and documents submitted successfully!");
        setFormData((prev) => ({
          ...prev,
          category: "",
          teamMember: "",
          overall_satisfaction: 0,
          communication_quality: 0,
          team_collaboration: 0,
          solution_quality: 0,
          feedback: "",
          milestone:"",
          attachment: null,
        }));
        setFiles({ experience: null, appreciation: null, certificate: null });
        onFeedbackSubmit?.(data.feedbackId, formData);
      } else {
        toast.error(data?.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadDocuments = () => {
    if (files.experience || files.appreciation || files.certificate) {
      toast.success("Documents attached successfully!");
      setShowUploadModal(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="bg-white flex flex-col relative mt-[6rem] rounded-3xl p-8 shadow-md border border-gray-200 h-[90vh] ">
        <Toaster position="top-right" />

        {/* Header Buttons */}
        <div className="flex justify-between items-center px-15 pb-6">
          <p className="text-left font-semibold text-xl">Your insights are valuable for us at Primus...</p>
          <div className="flex items-center gap-2">
            {!showDocumentLibrary ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowDocumentLibrary(true)}
                  className="text-black cursor-pointer font-semibold px-4 border-2 text-sm border-black py-1 rounded-3xl"
                >
                  Feedback History
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="text-black cursor-pointer font-semibold px-4 border-2 text-sm border-black py-1 rounded-3xl"
                >
                  Upload Document
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowDocumentLibrary(false)}
                className="mb-4 text-sm px-3 py-1 border rounded hover:bg-gray-100"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {showDocumentLibrary ? (
          <FeedBackAttachmentsPage />
        ) : (
          <div>
            {/* Form grid */}
           <div
  className={`grid grid-cols-1 ${
    formData.category === "Milestone Feedback" ? "md:grid-cols-4" : "md:grid-cols-3"
  } gap-6`}>
              {/* Project */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={loadingProject ? "Loading..." : selectedProject?.project_name}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback Category *</label>
                <Dropdown
                  value={formData.category}
                  options={categoriesList}
                  isOpen={showCategoryDropdown}
                  onToggle={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  onSelect={(option) => handleDropdownSelect("category", option)}
                  placeholder="Select Feedback Category"
                />
              </div>

              {formData.category === "Milestone Feedback" && modulesList.length > 0 && (
                <div className=" relative">
                  <label className="block text-sm mb-2 font-semibold text-gray-700">
                    Select Milestone
                  </label>

                  {/* Dropdown button */}
                  <div
                    onClick={() => setShowModuleDropdown(!showModuleDropdown)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-[0.9rem] text-sm flex justify-between items-center cursor-pointer  hover:bg-gray-50 transition"
                  >
                    <span className={"text-gray-800"}>
                      {selectedModule || "Select Module"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${showModuleDropdown ? "rotate-180" : "rotate-0"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown list */}
                  {showModuleDropdown && (
                    <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {modulesList.map((mod, index) => (
                        <div
                          key={index}
                          onClick={() => {
              if (mod.status === "completed") {
                setSelectedModule(mod.name);
                setFormData((prev) => ({
                  ...prev,
                  milestone: mod.name, // ✅ store milestone name in formData
                }));
                setShowModuleDropdown(false);
              }
            }}
                          className={`flex items-center justify-between px-3 py-2 cursor-pointer rounded-md ${mod.status === "completed"
                              ? "hover:bg-gray-100"
                              : "opacity-60 cursor-not-allowed"
                            }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-sm ${mod.status === "completed" ? "text-gray-800" : "text-gray-500"
                                }`}
                            >
                              {mod.name}
                            </span>
                            <span className="text-xs text-gray-400 capitalize">
                              {mod.status}
                            </span>
                          </div>

                          {/* Red icon for disabled (pending) modules */}
                          {mod.status !== "completed" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-red-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.707a1 1 0 011.414 0L10 13.414l-.707-.707zM9 7h2v4H9V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}



              {/* Team Member */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team Member</label>
                <select
                  value={formData.teamMember || ""}
                  onChange={(e) => setFormData({ ...formData, teamMember: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-[0.8rem] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Team Member</option>
                  {teamMembersList.map((member) => (
                    <option key={member.id} value={member.id}>{member.name} - {member.designation}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ratings */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { key: "overall", label: "Overall Satisfaction" },
                { key: "communication", label: "Communication Quality" },
                { key: "collaboration", label: "Team Collaboration" },
                { key: "solution", label: "Solution Quality" },
              ].map((item) => {
                let value;
                switch (item.key) {
                  case "overall": value = formData.overall_satisfaction; break;
                  case "communication": value = formData.communication_quality; break;
                  case "collaboration": value = formData.team_collaboration; break;
                  case "solution": value = formData.solution_quality; break;
                }
                return (
                  <div key={item.key} className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-700 mb-2">{item.label}</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(item.key, star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star
                            size={24}
                            className={`${star <= value ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback</label>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData((prev) => ({ ...prev, feedback: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Enter your feedback here..."
              />
            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-left w-[40%]">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#102437] text-white px-10 py-2 rounded-full font-medium transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        )}

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[800px] shadow-lg h-[430px]">
              <h2 className="text-lg font-semibold mb-4 text-center">Upload Required Documents</h2>
              <div className="space-y-4">
                {["experience", "appreciation", "certificate"].map((type) => (
                  <div key={type}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {type === "experience" ? "Experience Letter" : type === "appreciation" ? "Appreciation Letter" : "Completion Certificate"}
                    </label>
                    <label className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                      <span className="text-gray-600 text-sm">
                        {files[type] ? files[type].name : "Choose file..."}
                      </span>
                      <span className="bg-[#102437] text-white text-sm px-3 py-1 rounded-md">Browse</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg"
                        className="hidden"
                        onChange={(e) => setFiles(prev => ({ ...prev, [type]: e.target.files[0] }))}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-[6rem] py-2 cursor-pointer rounded-full border border-gray-300 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocuments}
                  className="px-[6rem] py-2 cursor-pointer rounded-full bg-[#102437] text-white font-medium"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default ShareFeedback;