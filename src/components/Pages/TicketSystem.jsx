import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import bgImageds from "../../assets/bgImageds.jpg";
import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import histroherobg from '../../assets/histroherobg.png';
import { selectSelectedProjectData, selectSelectedProjectId } from "../../redux/projectSlice";
 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 
const SupportTicketSystem = ({ onTicketCreate }) => {
  // ✅ Redux selectors
  const selectedProjectId = useSelector(selectSelectedProjectId);
  console.log(selectedProjectId,"it is the id for ticket");
const selectedProject = useSelector(selectSelectedProjectData); 
  console.log(selectedProject,"it is the selected project");
  const selectedProjectName = selectedProject ? selectedProject.project_name : "";
console.log(selectedProjectName, "Project Name for the selected ID");


  // const [selectedProjectName, setSelectedProjectStateName] = useState(null);

  const [formData, setFormData] = useState({
    escalationType: "",
    subject: "",
    project_name: "",
    urgency: "Low",
    description: "",
    executionDate: "",
    attachment: null,
  });


// Populate once selectedProject is available
useEffect(() => {
  if (selectedProject?.project_name) {
    setFormData(prev => ({
      ...prev,
      project_name: selectedProject.project_name,
    }));
  }
}, [selectedProject]);


  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
 
  const token = localStorage.getItem("authToken");
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    "Project Delay",
    "Quality Concern",
    "Data / Access Issue",
    "Communication Gap",
    "Billing & Payments",
    "Technical Issue",
    "Resource / Staffing Concern",
    "Change Request / Scope Issue",
    "Compliance / Policy Concern",
    "Other",
  ];
 
  // ✅ Service functions
  const ticketAPI = {
    getTickets: async () => {
      if (!selectedProjectId) return [];
 
      try {
        const res = await fetch(`${BACKEND_URL}/client/escalations/${selectedProjectId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
 
        if (!res.ok) {
          // Try to read the response text for debugging
          let errorText = "";
          try {
            errorText = await res.text();
          } catch (e) {
            errorText = "(Could not read response text)";
          }
          console.error("Failed to fetch tickets:", {
            status: res.status,
            statusText: res.statusText,
            body: errorText,
          });
          throw new Error(errorText || `Failed to fetch tickets (${res.status})`);
        }
 
        const data = await res.json();
        console.log("Fetched tickets:", data); // ✅ log the fetched data
        return data;
      } catch (err) {
        console.error("Error in getTickets:", err);
        throw err;
      }
    },
 
    createTicket: async (ticketData) => {
      const formDataObj = new FormData();
      formDataObj.append("project_id", selectedProjectId);
      formDataObj.append("type", ticketData.escalationType);
      formDataObj.append("urgency", ticketData.urgency);
      formDataObj.append("subject", ticketData.subject);
      formDataObj.append("description", ticketData.description);
      formDataObj.append(
        "execution_date",
        ticketData.executionDate
          ? new Date(ticketData.executionDate).toISOString().slice(0, 19)
          : new Date().toISOString().slice(0, 19)
      );
      if (ticketData.attachment) {
        formDataObj.append("attachment", ticketData.attachment);
      }
 
      const res = await fetch(`${BACKEND_URL}/client/escalations`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formDataObj,
      });
 
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to create ticket");
      }
 
      return res.json();
    },
 
    updateTicketStatus: async (ticketId, status) => {
      const res = await fetch(`${BACKEND_URL}/client/escalations/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update ticket status");
      console.log(res.data, "this is the ticket response")
      return { success: true };
    },
  };
 
  // ✅ Fetch tickets when project changes
  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please login again.");
      setLoading(false);
      return;
    }
    if (!selectedProjectId) {
      setError("Please select a project first.");
      setLoading(false);
      return;
    }
 
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketAPI.getTickets();
        setTickets(data);
        setFilteredTickets(data);
        setError(null);
        // Find the selected project
        const selected = data.find(t => t.project_id === selectedProjectId);
        if (selected) {
          setFormData(prev => ({
            ...prev,
            project_name: selected.project_name || ""
          }));
        }
        console.log("the ID id ", selected)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token, selectedProjectId]);
 
  // ✅ Filter tickets by search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTickets(tickets);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredTickets(
        tickets.filter(
          (t) =>
            String(t.short_id).toLowerCase().includes(q) ||  // ✅ Search by tracking ID
            (t.type && t.type.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, tickets]);
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async () => {
    if (!selectedProjectId) {
      // alert("Please select a project first.");
      toast.error("Please select a project first.");
 
      return;
    }
    if (!formData.escalationType || !formData.subject || !formData.description) {
      toast.error("Please fill in all required fields");
 
      return;
    }
    try {
      setSubmitting(true);
      const result = await ticketAPI.createTicket(formData);
      if (result) {
        const newList = [result, ...tickets];
        setTickets(newList);
        setFilteredTickets(newList);
        setFormData({
          escalationType: "",
          subject: "",
          urgency: "Low",
          description: "",
          executionDate: "",
          attachment: null,
        });
        onTicketCreate?.(result);
        // alert("Ticket created successfully!");
        toast.success("Ticket created successfully!");
      }
    } catch (err) {
      alert(`Error creating ticket: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
 
  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await ticketAPI.updateTicketStatus(ticketId, newStatus);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: newStatus, statusType: newStatus === "closed" ? "Reopen" : "Close" }
            : t
        )
      );
    } catch (err) {
      alert(`Error updating ticket status: ${err.message}`);
    }
  };
 
  // ✅ If no project selected, block UI
  if (!selectedProjectId || !selectedProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Please select a project to manage tickets.</p>
      </div>
    );
  }
  const URGENCY_OPTIONS = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];
  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="max-w-7xl mx-auto mt-[5rem] grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Left: Form --- */}
        <div className="bg-white/55 rounded-2xl shadow-sm p-5">
          <h2 className="text-xl font-semibold text-black text-center mb-3">
            Need guidance? We’re just a message away.
          </h2>
          <hr className="border-t-2 border-gray-300 w-1/3 mx-auto mb-4" />
 
          <label className="text-sm text-[#344054] px-2">Project Name</label>
<input
  type="text"
  name="project_name"
  value={formData.project_name}  // ✅ Match the state key
  onChange={handleInputChange}   // Optional: allow editing
  className="w-full px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
/>
 
          <div className="my-4">
            {/* <label className="text-sm text-[#344054] px-2">Select request category*</label>
            <div className="space-y-6">
              <select
                name="escalationType"
                value={formData.escalationType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-white"
              >
                <option value="">Tell your requirements </option>
                {[
                  "Project Delay",
                  "Quality Concern",
                  "Data / Access Issue",
                  "Communication Gap",
                  "Billing & Payments",
                  "Technical Issue",
                  "Resource / Staffing Concern",
                  "Change Request / Scope Issue",
                  "Compliance / Policy Concern",
                  "Other",
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div> */}
    <div className="relative w-full">
      <label className="block text-sm text-[#344054] px-2 mb-2">
        Select request category<span className="text-red-500">*</span>
      </label>
 
      {/* Dropdown Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 pl-3 pr-4 py-1 rounded-3xl bg-white border text-sm text-[#667085] cursor-pointer"
      >
        <span>
          {formData.escalationType
            ? formData.escalationType
            : "Tell your requirements"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
 
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 rounded-xl py-3 px-2 flex flex-col bg-white w-full shadow-md z-50 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {categories.map((type) => (
            <div
              key={type}
              onClick={() => {
                handleInputChange({
                  target: { name: "escalationType", value: type },
                });
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 ${
                formData.escalationType === type
                  ? "bg-gray-100 text-gray-800 font-medium"
                  : "text-gray-700"
              }`}
            >
              {type}
            </div>
          ))}
        </div>
      )}
    </div>
 
            <div className="my-4">
 
              <label className="text-sm text-[#344054] px-2">Subject</label>
 
              {/* Subject */}
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter subject"
                className="w-full px-4 py-2 placeholder:text-gray-700 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              />
 
            </div>
            {/* Urgency */}
            <div className="my-4">
 
              <label className="text-sm text-[#344054] px-2">Priority Level</label>
 
              <div className="flex space-x-6 my-1">
                {URGENCY_OPTIONS.map((level) => (
                  <label key={level.value} className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
 
            {/* Description & Attachment */}
            <div className="relative my-4">
              <label className="text-sm text-[#344054] px-2"> Describe the requirements</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the requirements"
                rows={4}
                className="w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none pr-10"
              />
              <label className="absolute bottom-2 right-2 cursor-pointer text-gray-500 hover:text-blue-600">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setFormData((prev) => ({ ...prev, attachment: file }));
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 00-5.656-5.656L5.343 11.172a6 6 0 108.485 8.485L20.485 13" />
                </svg>
              </label>
            </div>
 
            {formData.attachment && (
              <div className="flex items-center mt-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                <span className="truncate flex-1">{formData.attachment.name}</span>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, attachment: null }))}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
 
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Escalation"}
            </button>
          </div>
        </div>
 
        {/* --- Right: Ticket History --- */}
        <div className="rounded-2xl bg-white  overflow-y-auto">
          <div className="flex flex-col items-center justify-between mb-4  rounded-3xl"
          >
            <div className="flex items-center justify-between h-15 w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${histroherobg})` }} >
              <h2 className="text-xl px-7 text-center font-semibold text-gray-900"   >
 
                Your Request History
              </h2>
              <div className="flex items-center px-7 gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-58 border-gray-400 ">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-4xl bg-white border border-black text-black placeholder-black focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                </div>
              </div>
            </div>
            <div className="bg-white w-full  ">
              <div className="grid grid-cols-4 py-3 px-10 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                <div>Request ID</div>
                <div>Date of Request</div>
                <div>Request Category</div>
                <div>Request Status</div>
              </div>
 
              <div className="space-y-2 max-h-150 custom-scroll overflow-y-auto ">
                {loading ? (
                  <div className="flex justify-center py-8">Loading...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">{error}</div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-8 pl-10 text-gray-500">
                    {searchQuery
                      ? "No tickets found matching your search."
                      : "No tickets found."}
                  </div>
                ) : (
                  filteredTickets.map((t, idx) => (
                    <div
                      key={t._id}
                      className="grid grid-cols-4 gap-4 py-3 px-10  text-sm"
                    >
                      <div className="font-medium">
                        {t.short_id}
                        {/* RE-{idx+101} */}
                      </div>
                      <div>
                        {new Date(t.date_of_escalation).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div>{t.type}</div>
                      <div>
                        {t.status === "closed" ? (
                          <span className="text-red-600">Closed</span>
                        ) : (
                          <span className="text-green-600">Open</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
 
    </div>
  );
};
 
export default SupportTicketSystem;
 
 