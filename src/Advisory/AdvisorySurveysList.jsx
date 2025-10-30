import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import bgImageds from "./bgImageds.jpg";
import { FaStar } from "react-icons/fa";

const AdvisorySurveysList = () => {
  const surveys = Array.from({ length: 25 }, (_, i) => ({
    id: `S-${1025 + i}`,
    title: "Q2 Advisor Feedback Survey",
    category: ["Feedback", "Research", "Performance"][i % 3],
    deadline: "25 Aug 2025",
    status: i % 4 === 0 ? "Completed" : "Active",
    questions: Math.floor(Math.random() * 20) + 1,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(surveys.length / itemsPerPage);

  const currentItems = surveys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [formData, setFormData] = useState({
    q1: "",
    q2: 0,
    q3: "",
  });

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleOpenSurvey = (survey) => {
    setSelectedSurvey(survey);
    setFormData({
      q1: "",
      q2: 0,
      q3: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey submitted:", formData);
    alert("Survey submitted successfully!");
    setSelectedSurvey(null);
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
        onClick={() => handleInputChange("q2", i + 1)}
      />
    ));
  };

  return (
    <section className="-mt-[5rem] min-h-screen w-full bg-gradient-to-b from-white via-white to-amber-50 bg-cover bg-center bg-no-repeat p-6"
     style={{ backgroundImage: `url(${bgImageds})` }}
    >
      {selectedSurvey ? (
        <div className="mt-[5rem] bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedSurvey(null)}
              className="text-black font-bold mr-4 cursor-pointer text-lg"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{selectedSurvey.id} - {selectedSurvey.title}</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-4">
                Deadline: {selectedSurvey.deadline} | Time left: {selectedSurvey.deadline}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Help us improve our advisory collaboration by rating communication, clarity of requirements, and project execution.
              </p>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Q1: How would you rate the clarity of project requirements?
                  </label>
                  <div className="flex space-x-4">
                    {["Excellent", "Good", "Average", "Poor"].map((option) => (
                      <label key={option} className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="q1"
                          value={option}
                          checked={formData.q1 === option}
                          onChange={(e) => handleInputChange("q1", e.target.value)}
                          className="form-radio text-blue-600 focus:ring-0"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Q2: How would you rate the clarity of project requirements?
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(formData.q2)}
                    <span className="ml-2 text-sm text-gray-500">({formData.q2}/5)</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Q3: Suggestions for improvement
                  </label>
                  <textarea
                    value={formData.q3}
                    onChange={(e) => handleInputChange("q3", e.target.value)}
                    placeholder="Enter your Suggestion"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#102437] text-white px-6 py-3 rounded-lg hover:bg-[#1c3453] transition-colors"
            >
              Submit Survey
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-[5rem] bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Surveys List</h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search.."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="text-gray-500 border-b border-dashed">
                  <th className="py-3 px-4 text-left">Survey ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Deadline</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Questions</th>
                  <th className="py-3 px-4 text-right">Participate in Survey</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((survey, index) => (
                  <tr
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-lg"
                  >
                    <td className="py-3 px-4 font-medium">{survey.id}</td>
                    <td className="py-3 px-4">{survey.title}</td>
                    <td className="py-3 px-4">{survey.category}</td>
                    <td className="py-3 px-4">{survey.deadline}</td>
                    <td className="py-3 px-4">
                      {survey.status === "Completed" ? (
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                          ● Completed
                        </span>
                      ) : (
                        <span className="text-red-500 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                          ● Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {survey.questions}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-600 font-semibold cursor-pointer hover:underline"
                      onClick={() => handleOpenSurvey(survey)}
                    >
                      Open Survey
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-[2rem]">
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
      )}
    </section>
  );
};

export default AdvisorySurveysList;