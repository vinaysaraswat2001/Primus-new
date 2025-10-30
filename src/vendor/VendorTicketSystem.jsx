import { useEffect, useState } from "react";
import { Search, Paperclip } from "lucide-react";
import bgImageds from "./bgImageds.jpg";

const API_BASE = "http://127.0.0.1:8000/vendor";

const VendorTicketSystem = () => {
  const [formData, setFormData] = useState({
    escalationType: "",
    subject: "",
    urgency: "Low",
    description: "",
    executionDate: "",
    attachment: null,
  });
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const token = localStorage.getItem("authToken");

  // ✅ Vendor API functions
  const vendorAPI = {
    getTickets: async () => {
      try {
        const res = await fetch(`${API_BASE}/escalations`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (res.status === 401) {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          return [];
        }

        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
      } catch (err) {
        console.error("Error fetching tickets:", err);
        return [];
      }
    },

    createTicket: async (ticketData) => {
      const formDataObj = new FormData();
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
        formDataObj.append("files", ticketData.attachment);
      }

      const res = await fetch(`${API_BASE}/escalations`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: formDataObj,
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create ticket");
      }

      return res.json();
    },
  };

  // ✅ Fetch tickets on mount
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    const fetchTickets = async () => {
      setLoading(true);
      const data = await vendorAPI.getTickets();
      setTickets(data);
      setLoading(false);
    };
    fetchTickets();
  }, [token]);

  // ✅ Filter tickets
  useEffect(() => {
    setFilteredTickets(
      tickets.filter(
        (t) =>
          t.short_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [tickets, searchQuery]);

  // ✅ Handle form submit
  const handleSubmit = async () => {
    if (!formData.escalationType || !formData.subject || !formData.description) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await vendorAPI.createTicket(formData);
      alert("Ticket submitted successfully!");
      setFormData({
        escalationType: "",
        subject: "",
        urgency: "Low",
        description: "",
        executionDate: "",
        attachment: null,
      });

      // Refresh tickets
      const data = await vendorAPI.getTickets();
      setTickets(data);
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, attachment: file });
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, attachment: null });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please log in to access the Vendor Ticket System.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-[#102437] text-white px-6 py-2 rounded-full hover:bg-[#081627]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-[5rem]">
        {/* --- Left: Form --- */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2">
            Need guidance? We’re just a message away.
          </h2>

          {/* Select Category */}
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
    <option value="Payment Delay / Discrepancy">Payment Delay / Discrepancy</option>
    <option value="Payment Followup">Payment Followup</option>
    <option value="Purchase Order Issue">Purchase Order Issue</option>
    <option value="Invoice Rejection / Clarification">Invoice Rejection / Clarification</option>
    <option value="Meeting / Communication Delay">Meeting / Communication Delay</option>
    <option value="Contract / Compliance Concern">Contract / Compliance Concern</option>
    <option value="Urgent Support Request">Urgent Support Request</option>
    <option value="Policy / Approval Escalation">Policy / Approval Escalation</option>
    <option value="Other">Other</option>
  </select>
</div>


          {/* Subject */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Subject / Description
            </label>
            <input
              type="text"
              placeholder="Subject / Description"
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
    {[
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ].map((option) => (
      <label key={option.value} className="flex items-center space-x-2">
        <input
          type="radio"
          value={option.value}
          checked={formData.urgency === option.value}
          onChange={(e) =>
            setFormData({ ...formData, urgency: e.target.value })
          }
          className="text-blue-600 focus:ring-blue-500"
        />
        <span>{option.label}</span>
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

          {/* Show selected file */}
          {formData.attachment && (
            <div className="mb-[1rem] flex items-center mt-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
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
            disabled={submitting}
            className={`w-full py-2.5 rounded-full transition flex items-center justify-center gap-2 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#102437] hover:bg-[#081627] cursor-pointer text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* --- Right: Ticket History --- */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Request History</h2>

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
                className="pl-10 pr-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-60"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border-b border-gray-100">
            <div>Request ID</div>
            <div>Date of Request</div>
            <div>Request Category</div>
            <div>Request Status</div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-scroll scrollbar-hide mt-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-4 py-3 px-4 text-sm text-gray-700 border-b border-gray-100"
                >
                  <div>{ticket.short_id}</div>
                  <div>
                    {new Date(ticket.date_of_escalation).toLocaleDateString("en-IN")}
                  </div>
                  <div>{ticket.type}</div>
                  <div
                    className={`${
                      ticket.status === "Closed" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {ticket.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No requests found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorTicketSystem;
