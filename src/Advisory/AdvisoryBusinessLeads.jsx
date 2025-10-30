import React, { useState } from "react";
import { FaSearch, FaDownload } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import bgImageds from "./bgImageds.jpg";

const AdvisoryBusinessLeads = () => {
  const [leads, setLeads] = useState([
    {
      id: "BL-001",
      title: "Supply Chain Optimization for FMCG",
      description:
        "Our FMCG client is seeking expertise in warehouse operations optimization to reduce delivery time by at least 15% while maintaining cost efficiency. The project involves audits, technology assessment, and change management training.",
      employee: "Anil Sharma",
      industry: "Supply Chain",
      created: "5 Aug 2025",
      duration: "6 Months",
      budget: "₹15,00,000 – ₹20,00,000",
      location: "Hybrid – Mumbai & Remote",
      attachment: "Project Brief.pdf",
    },
    // Sample additional dummy data for testing pagination
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `BL-${(i + 2).toString().padStart(3, "0")}`,
      title: `Business Lead ${i + 2}`,
      description:
        "This is a sample description for business lead showcasing pagination feature in the table view.",
      employee: `Employee ${i + 2}`,
      industry: "Consulting",
      created: `10 Sep 2025`,
      duration: "6 Months",
      budget: "₹10,00,000 – ₹12,00,000",
      location: "Remote",
      attachment: "Lead Details.pdf",
    })),
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLead, setNewLead] = useState({
    advisor: "Anil Sharma",
    id: "",
    title: "",
    date: "2025-05-01",
    budget: "",
    location: "",
    employee: "",
    description: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(leads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const displayedLeads = leads.slice(startIndex, startIndex + leadsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLead((p) => ({ ...p, [name]: value }));
  };

  const handleSubmitLead = (e) => {
    e.preventDefault();
    const lead = {
      id: newLead.id || `BL-${(leads.length + 1).toString().padStart(3, "0")}`,
      title: newLead.title,
      description: newLead.description,
      employee: newLead.employee,
      industry: newLead.location || "General",
      created: newLead.date,
      duration: "6 Months",
      budget: newLead.budget,
      location: newLead.location,
      attachment: "New Lead Attachment.pdf",
    };
    setLeads((prev) => [...prev, lead]);
    setShowForm(false);
  };

  const truncateWords = (text, limit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
  };

  return (
    <section
      className="-mt-[5rem] min-h-screen w-full bg-gradient-to-b from-white via-white to-amber-50 bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      {/* =================== 1. LEAD LIST =================== */}
      {!showForm && !selectedLead && (
        <>
          <div className="mt-[5rem] flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">My Leads</h2>

            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="cursor-pointer bg-[#102437] hover:bg-[#1c3453] text-white rounded-full px-5 py-2 text-sm shadow"
              >
                Submit a Lead
              </button>
            </div>
          </div>

          {/* table */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-dashed">
                    {/* <th className="py-3 px-4 font-medium">Lead ID</th> */}
                    <th className="py-3 px-4 font-medium">Tracking Id</th>
                    <th className="py-3 px-4 font-medium">Title</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium">Employee Name</th>
                    <th className="py-3 px-4 font-medium">Industry</th>
                    <th className="py-3 px-4 font-medium">Created Date</th>
                    <th className="py-3 px-4 font-medium text-right">
                      Detail View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLeads.map((lead, i) => (
                    <tr
                      key={i}
                      className="bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                    >
                      <td className="py-3 px-4 font-medium">{lead.id}</td>
                      <td className="py-3 px-4">{lead.title}</td>
                      <td className="py-3 px-4 text-gray-500 truncate">
                        {truncateWords(lead.description, 4)}
                      </td>
                      <td className="py-3 px-4">{lead.employee}</td>
                      <td className="py-3 px-4">{lead.industry}</td>
                      <td className="py-3 px-4">{lead.created}</td>
                      <td
                        className="py-3 px-4 text-right text-amber-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => setSelectedLead(lead)}
                      >
                        View
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center p-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#102437] text-white hover:bg-[#1c3453]"
                  }`}
              >
                ← Previous
              </button>

              <span className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#102437] text-white hover:bg-[#1c3453]"
                  }`}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* =================== 2. SUBMIT FORM =================== */}
      {showForm && !selectedLead && (
        <div className="mt-[6rem] bg-white rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowForm(false)}
              className="cursor-pointer text-2xl"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Submit a New Lead
            </h2>
          </div>

          <form onSubmit={handleSubmitLead} className="space-y-6 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-600 mb-1 text-xs">
                  Advisor Name
                </label>
                <input
                  readOnly
                  value={newLead.advisor}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              {/* <div>
                <label className="block text-gray-600 mb-1 text-xs">
                  Lead ID
                </label>
                <input
                  name="id"
                  value={newLead.id}
                  onChange={handleInputChange}
                  placeholder="Enter Lead ID (Auto)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div> */}
              <div>
                <label className="block text-gray-600 mb-1 text-xs">Title</label>
                <input
                  name="title"
                  value={newLead.title}
                  onChange={handleInputChange}
                  placeholder="Enter Title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-xs">
                  Budget
                </label>
                <input
                  name="budget"
                  value={newLead.budget}
                  onChange={handleInputChange}
                  placeholder="Enter Budget"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
<div>
  <label className="block text-gray-600 mb-1 text-xs">
    Choose Date*
  </label>
  <input
    type="date"
    name="date"
    value={new Date().toISOString().split("T")[0]} // 👈 always shows today's date
    readOnly // optional: prevents editing
    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
  />
</div>
              <div>
                <label className="block text-gray-600 mb-1 text-xs">
                  Location
                </label>
                <input
                  name="location"
                  value={newLead.location}
                  onChange={handleInputChange}
                  placeholder="Enter Location"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-xs">
                  Employee Name
                </label>
                <input
                  name="employee"
                  value={newLead.employee}
                  onChange={handleInputChange}
                  placeholder="Enter Employee Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1 text-xs">
                Proposal / Interest Statement
              </label>
              <textarea
                name="description"
                value={newLead.description}
                onChange={handleInputChange}
                placeholder="Enter Proposal / Interest Statement"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 resize-none"
              />
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-2 rounded-full bg-[#102437] text-white font-medium hover:bg-[#1c3453]"
              >
                Submit Lead Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================== 3. LEAD DETAILS =================== */}
      {selectedLead && (
        <div className="mt-[6rem] bg-white rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedLead(null)}
              className="text-2xl cursor-pointer"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold">
              {selectedLead.id} – Lead Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
            <div className="bg-amber-50 rounded-xl p-6">
              <h3 className="font-semibold mb-3 text-gray-800">
                Lead Details Page
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>Lead ID:</strong> {selectedLead.id}
                </li>
                <li>
                  <strong>Title:</strong> {selectedLead.title}
                </li>
                <li>
                  <strong>Posted Date:</strong> {selectedLead.created}
                </li>
                <li>
                  <strong>Duration:</strong> {selectedLead.duration}
                </li>
                <li>
                  <strong>Budget:</strong> {selectedLead.budget}
                </li>
                <li>
                  <strong>Location:</strong> {selectedLead.location}
                </li>
                <li>
                  <strong>Employee Name:</strong> {selectedLead.employee}
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedLead.description}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Attachments</h4>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm w-fit hover:bg-amber-50 transition">
                  <HiOutlineDocumentText className="text-red-500 text-3xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {selectedLead.attachment}
                    </p>
                    <p className="text-xs text-gray-500">2 MB • Click to download</p>
                  </div>
                  <a
                    href={`/${selectedLead.attachment}`} // ✅ adjust path as per your file location
                    download={selectedLead.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-gray-600 transition cursor-pointer"
                    title="Download Attachment"
                  >
                    <FaDownload className="text-lg" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdvisoryBusinessLeads;