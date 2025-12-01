import { useState, useEffect } from "react";
import { Search, Paperclip, AlertTriangle, Clock } from "lucide-react";
import bgImageds from "../assets/bgImageds.jpg";

const AlumniTicketSystem = () => {
  const [formData, setFormData] = useState({
    escalationType: "",
    subject: "",
    urgency: "Low",
    description: "",
    attachment: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);

  // Dummy data with SLA times and escalation level
  const dummyTickets = [
    {
      id: "DD776H90",
      date: "08/07/24",
      category: "Operational",
      status: "Closed",
      slaHours: 24,
      createdAt: "2024-07-08T08:00:00Z",
      escalationLevel: 0,
    },
    {
      id: "DD776H91",
      date: "08/07/24",
      category: "Technical",
      status: "Open",
      slaHours: 12,
      createdAt: "2024-07-09T10:00:00Z",
      escalationLevel: 1,
    },
    {
      id: "DD776H92",
      date: "08/07/24",
      category: "Billing",
      status: "Pending",
      slaHours: 48,
      createdAt: "2024-07-09T11:00:00Z",
      escalationLevel: 2,
    },
  ];

  useEffect(() => {
    setTickets(dummyTickets);
  }, []);

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, attachment: file });
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, attachment: null });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  // SLA Time Calculation
  const getSLAStatus = (ticket) => {
    const created = new Date(ticket.createdAt);
    const now = new Date();
    const hoursPassed = (now - created) / (1000 * 60 * 60);
    const remaining = ticket.slaHours - hoursPassed;

    if (remaining <= 0) return { text: "SLA Breached", color: "text-red-600" };
    if (remaining < 3)
      return { text: `⚠️ ${remaining.toFixed(1)}h left`, color: "text-yellow-600" };
    return { text: `${remaining.toFixed(1)}h remaining`, color: "text-green-600" };
  };

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="max-w-8xl mx-auto mt-[5rem] grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* --- Left: Form --- */}
        <div className="bg-white rounded-xl shadow-xl p-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-3">
            Need guidance? We’re just a message away.
          </h2>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Select request category*
            </label>
            <select
              value={formData.escalationType}
              onChange={(e) =>
                setFormData({ ...formData, escalationType: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tell your requirements</option>
              <option value="Operational">Operational</option>
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Other">Others</option>
            </select>
          </div>

          {/* Subject */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Subject/ Description
            </label>
            <input
              type="text"
              placeholder="Subject/ Description"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Priority Level
            </label>
            <div className="flex items-center space-x-6 text-sm">
              {["Low", "Medium", "High"].map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={(e) =>
                      setFormData({ ...formData, urgency: e.target.value })
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description + File Upload */}
          <div className="mb-5 relative">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Describe the requirements
            </label>
            <textarea
              placeholder="Describe the requirements"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none pr-10"
            />
            <label className="absolute bottom-3 right-3 cursor-pointer text-gray-500 hover:text-blue-600">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
              <Paperclip size={18} />
            </label>
          </div>

          {/* Selected File */}
          {formData.attachment && (
            <div className="mb-5 flex items-center mt-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
              <span className="truncate flex-1">{formData.attachment.name}</span>
              <button
                onClick={handleRemoveFile}
                className="cursor-pointer ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-full transition flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#102437] hover:bg-[#081627] text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {/* --- Right: Ticket History --- */}
        <div className="bg-white rounded-xl shadow-xl p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Request History
            </h2>

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5  py-3 px-4 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border-b border-gray-200">
            <div>Request ID</div>
            <div>Date</div>
            <div>Category</div>
            <div>Status</div>
            <div>SLA / Escalation</div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto scrollbar-hide mt-2">
            {filteredTickets.map((ticket, idx) => {
              const slaStatus = getSLAStatus(ticket);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-5 gap-4 py-3 px-4 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 transition-all items-center rounded-lg"
                >
                  <div className="font-medium text-gray-800">{ticket.id}</div>
                  <div>{ticket.date}</div>
                  <div>{ticket.category}</div>
                  <div
                    className={`font-semibold ${
                      ticket.status === "Closed"
                        ? "text-green-600"
                        : ticket.status === "Pending"
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  >
                    {ticket.status}
                  </div>

                  {/* SLA / Escalation */}
                  <div className="flex flex-col gap-1">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${slaStatus.color}`}
                    >
                      <Clock size={12} className="text-gray-500" />
                      {slaStatus.text}
                    </span>

                    {/* Escalation Badge */}
                    {ticket.escalationLevel === 0 && (
                      <span className="text-[11px] px-2 py-[2px] rounded-full w-fit bg-green-100 text-green-600">
                        Normal
                      </span>
                    )}
                    {ticket.escalationLevel === 1 && (
                      <span className="text-[11px] px-2 py-[2px] rounded-full w-fit bg-yellow-100 text-yellow-600 flex items-center gap-1">
                        <AlertTriangle size={11} /> Level 1
                      </span>
                    )}
                    {ticket.escalationLevel === 2 && (
                      <span className="text-[11px] px-2 py-[2px] rounded-full w-fit bg-red-100 text-red-600 flex items-center gap-1">
                        <AlertTriangle size={11} /> Level 2
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniTicketSystem;