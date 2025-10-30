import React, { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import bgImageds from "./bgImageds.jpg";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Frontend category options
const categoriesList = [
  "Procurement Process",
  "Payment & Finance",
  "Communication & Support",
  "Meeting & Coordination",
  // "System Experience (Portal / D365)",
  // "Policy & Compliance",
  // "Overall Experience",
  // "Suggestions for Improvement",
  "Other",
];

const Dropdown = ({ value, options, isOpen, onToggle, onSelect, placeholder }) => (
  <div className="relative w-full">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none"
    >
      <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {options.length === 0 ? (
          <div className="px-4 py-3 text-gray-500">No options found</div>
        ) : (
          options.map((option, i) => (
            <button
              key={i}
              onClick={() => onSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              {option}
            </button>
          ))
        )}
      </div>
    )}
  </div>
);

const Rating = ({ label, value, onChange }) => (
  <div className="flex flex-col items-start gap-2">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
          aria-label={`${label} ${star} star`}
        >
          <Star
            size={22}
            className={`${star <= value ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  </div>
);

const VendorFeedback = ({ onFeedbackSubmit }) => {
  const VendorName = localStorage.getItem("Name") || "vendor";
  const token = localStorage.getItem("authToken");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    communication_quality: 0,
    team_collaboration: 0,
    overall_satisfaction: 0,
    feedback: "",
  });

  const handleDropdownSelect = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setDropdownOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.feedback.trim()) {
      toast.error("Please select a category and write your feedback.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("vendor_email", localStorage.getItem("Email") || "");
      payload.append("category", formData.category);
      payload.append("communication_quality", formData.communication_quality);
      payload.append("team_collaboration", formData.team_collaboration);
      payload.append("overall_satisfaction", formData.overall_satisfaction);
      payload.append("comments", formData.feedback);

      files.forEach((f) => payload.append("files", f));

      const { data } = await axios.post(`${BACKEND_URL}/vendor/feedback`, payload, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        withCredentials: true,
      });

      if (data?._id) {
        toast.success("Feedback submitted successfully!");
        onFeedbackSubmit?.(data._id, formData);
        setFormData({
          category: "",
          communication_quality: 0,
          team_collaboration: 0,
          overall_satisfaction: 0,
          feedback: "",
        });
        setFiles([]);
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

  return (
    <div style={{ backgroundImage: `url(${bgImageds})` }}>
      <div className="md:p-8 -mt-[5rem]">
        <Toaster position="top-right" />

        <div className="bg-white rounded-3xl p-6 mt-[4rem]">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {`Mrs. ${VendorName}, your insights are valuable for us at Primus...`}
            </h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById("vf-file-input")?.click()}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition cursor-pointer"
              >
                Upload Documents
              </button>
              <input
                id="vf-file-input"
                type="file"
                className="hidden"
                multiple
                onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Feedback Category *</label>
              <Dropdown
                value={formData.category}
                options={categoriesList}
                isOpen={dropdownOpen}
                onToggle={() => setDropdownOpen((o) => !o)}
                onSelect={handleDropdownSelect}
                placeholder="Select Feedback Category"
              />
            </div>

            {/* Ratings */}
            <Rating
              label="Communication Quality"
              value={formData.communication_quality}
              onChange={(v) => setFormData((p) => ({ ...p, communication_quality: v }))}
            />
            <Rating
              label="Team Collaboration"
              value={formData.team_collaboration}
              onChange={(v) => setFormData((p) => ({ ...p, team_collaboration: v }))}
            />
            <Rating
              label="Overall Satisfaction"
              value={formData.overall_satisfaction}
              onChange={(v) => setFormData((p) => ({ ...p, overall_satisfaction: v }))}
            />
          </div>

          <div className="mb-6 md:mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Write Feedback</label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData((prev) => ({ ...prev, feedback: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-gray-400"
              placeholder="Share your comments or suggestions"
            />
          </div>

          {files.length > 0 && (
            <div className="mb-4 text-sm text-gray-600">{files.length} document(s) selected</div>
          )}

          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 md:px-8 py-3 rounded-full font-medium text-white bg-[#102437] hover:bg-[#0b1a2a] transition cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorFeedback;
