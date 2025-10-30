import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPaperclip,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import Footer from "../navbars/Footer/Footer";

// Reusable Dropdown Component
const DropdownInput = ({ label, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onChange(option); // ✅ Pass selected value back to parent
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#F5F5F5] text-gray-500 px-4 py-2 rounded w-full flex justify-between items-center"
      >
        {selected || label}
        <FaChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow mt-1 max-h-48 overflow-auto">
          {options.map((option, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ProjectIssueAlert = () => {
  const navigate = useNavigate();

  const [priority, setPriority] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [escalationType, setEscalationType] = useState("");
  const [concern, setConcern] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!selectedDate || !escalationType || !priority || !concern.trim()) {
      setError("Please fill all fields before submitting.");
      return;
    }

    setError(""); // Clear previous error
    console.log({
      selectedDate,
      escalationType,
      priority,
      concern,
      uploadedFile,
    });

    // You can proceed to call your API here
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-md mx-auto">
        {/* Header */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft className="text-black" />
          <h1 className="text-xl font-semibold text-black">Project Issue Alert</h1>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Date Dropdown */}
            <div className="w-full sm:w-1/3">
              {/* Native Date Input */}
              <input
                type="date"
                className="bg-[#F5F5F5] text-gray-500 px-4 py-2 rounded w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>


            {/* Escalation Type Dropdown */}
            <div className="w-full sm:w-1/3">
              <DropdownInput
                label="Type of Escalation"
                options={["Operational", "Technical"]}
                onChange={setEscalationType}
              />
            </div>

            {/* Priority Buttons */}
            <div className="flex gap-3 w-full sm:w-1/3">
              {["Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`w-full py-2 rounded text-white font-medium ${priority === level
                      ? level === "Low"
                        ? "bg-[#319F43C2]"
                        : level === "Medium"
                          ? "bg-[#F89900]"
                          : "bg-[#91231A]"
                      : "bg-gray-300"
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Concern Box with Optional Upload */}
          <div className="relative bg-[#F5F5F5] p-4 rounded text-gray-500">
            <textarea
              placeholder="Write concern..."
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              className="w-full bg-transparent outline-none resize-none"
              rows="4"
            />

            {/* File preview */}
            {uploadedFile && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-2 py-1 rounded shadow text-sm text-black max-w-[150px] truncate">
                <span className="truncate">{uploadedFile.name}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Paperclip Upload Icon */}
            <label
              htmlFor="file-upload"
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#441410] flex items-center justify-center cursor-pointer"
            >
              <FaPaperclip className="text-white text-sm" />
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setUploadedFile(file);
              }}
            />
          </div>
        </div>

        {/* Submit & Discard Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleSubmit}
              className="cursor-pointer bg-[#142434] text-white rounded px-6 py-2 w-full sm:w-[458px] h-[40px]"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setSelectedDate("");
                setEscalationType("");
                setPriority("");
                setConcern("");
                setUploadedFile(null);
                setError("");
              }}
              className="cursor-pointer bg-[#AD8051] text-white px-6 py-2 rounded w-full sm:w-[458px] h-[40px]"
            >
              Discard
            </button>
          </div>
        </div>

        {/* Optional Error Message */}
        {error && (
          <p className="text-red-600 text-sm font-medium mt-2">{error}</p>
        )}

        {/* Ticket History Button */}
        <button className="bg-[#441410] w-full text-white px-6 py-2 rounded text-left mt-6">
          Your Ticket History
        </button>

        {/* Ticket Summary */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-6 gap-4 text-sm text-gray-600 mb-4">
            <div className="font-medium">Tracking ID</div>
            <div className="font-medium">Date of escalation</div>
            <div className="font-medium">Date of execution</div>
            <div className="font-medium">Escalation Type</div>
            <div className="font-medium">Escalation Status</div>
            <div className="font-medium">Actions</div>
          </div>
          <div className="grid grid-cols-6 gap-4 text-sm bg-gray-100 p-4 items-center rounded">
            <div className="font-semibold">DD776H90</div>
            <div className="font-semibold">08/07/24</div>
            <div className="font-semibold">08/07/24</div>
            <div className="font-semibold">Operational</div>
            <div className="font-semibold flex items-center">
              <span className="text-grey-600 mr-2">Closed /</span>
              <span className="text-green-600 cursor-pointer">Reopen?</span>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-red-800 text-white px-4 py-2 rounded text-sm">
                High
              </button>
              <button className="bg-blue-900 text-white px-4 py-2 rounded text-sm cursor-pointer">
                View details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ProjectIssueAlert;