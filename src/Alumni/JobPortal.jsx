import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaShareAlt, FaWhatsapp, FaEnvelope, FaRegCopy } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import bgImageds from "./bgImageds.jpg";

const JobPortal = ({ minimal }) => {
  const location = useLocation();
  const selectedJobFromState = location.state?.job;

  const jobs = [
    {
      id: 1,
      title: "UIUX Designer",
      company: "Primus Partners Private Limited",
      location: "New Delhi, India",
      salary: "₹1,60,000 – ₹2,40,000 INR/Month",
      posted: "10 mins ago",
      jobType: "Full-time",
      workType: "Hybrid",
      experience: "4 Years",
      description: [
        "Create and render design concepts for existing and new products",
        "Work with marketing team to create materials that highlight product features and benefits",
      ],
      requirement: [
        "Design Skills: Experience in designing in Figma",
        "Academic: Advanced qualification in Product Design, HCI, or related field",
      ],
      referLink: "https://primuspartners.in/jobs/uiux-designer",
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "Primus Partners Private Limited",
      location: "New Delhi, India",
      salary: "₹1,60,000 – ₹2,40,000 INR/Month",
      posted: "10 mins ago",
      jobType: "Full-time",
      workType: "Hybrid",
      experience: "3 Years",
      description: [
        "Build predictive models and machine learning pipelines",
        "Collaborate with cross-functional teams to analyze data trends",
      ],
      requirement: [
        "Proficiency in Python, SQL, and data visualization",
        "Experience with ML frameworks like TensorFlow or PyTorch",
      ],
      referLink: "https://primuspartners.in/jobs/data-scientist",
    },
    {
      id: 3,
      title: "Project Manager – IT",
      company: "Primus Partners Private Limited",
      location: "New Delhi, India",
      salary: "₹1,80,000 – ₹2,80,000 INR/Month",
      posted: "15 mins ago",
      jobType: "Full-time",
      workType: "On-site",
      experience: "6 Years",
      description: [
        "Oversee multiple IT projects simultaneously",
        "Ensure timely delivery and resource management",
      ],
      requirement: [
        "Experience managing cross-functional teams",
        "Strong knowledge of Agile methodologies",
      ],
      referLink: "https://primuspartners.in/jobs/project-manager",
    },
  ];

  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [hoveredShare, setHoveredShare] = useState(null);

  useEffect(() => {
    if (selectedJobFromState) setSelectedJob(selectedJobFromState);
  }, [selectedJobFromState]);

  const handleShareCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("🔗 Job link copied to clipboard!");
  };

  const handleWhatsAppShare = (link) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank");
  };

  const handleEmailShare = (link) => {
    window.location.href = `mailto:?subject=Job Opportunity&body=Check this job: ${link}`;
  };

  if (minimal) {
    return (
      <div className="-mt-[1rem] bg-white p-4 rounded-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Job & Internship Opportunities
        </h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex justify-between items-center p-3 rounded-2xl shadow-sm border bg-white hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm text-[#F4B472] font-medium">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                <p className="text-xs text-gray-400 mt-1">Posted {job.posted}</p>
              </div>
              <button
                onClick={() => window.location.assign("/job-portal")}
                className="cursor-pointer border px-4 py-1 rounded-lg text-sm font-medium bg-[#102437] text-white border-[#102437] transition hover:bg-[#1d3b5a]"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full page view
  return (
    <section
      className="-mt-[5rem] min-h-screen bg-gradient-to-b from-white via-white to-amber-50 p-6"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="mt-[5rem] grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Job list */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none"
                />
              </div>
              <button className="cursor-pointer flex items-center gap-1 bg-[#102437] hover:bg-[#1d3b5a] text-white rounded-full px-4 py-2 text-sm transition">
                <FaFilter /> Filter
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`flex justify-between items-center p-4 rounded-2xl shadow-sm border transition cursor-pointer ${
                  selectedJob.id === job.id
                    ? "border-[#102437] bg-[#f3f6fb]"
                    : "bg-gray-50 border-gray-100 hover:shadow-md"
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-sm text-[#F4B472] font-medium">{job.company}</p>
                  <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                  <p className="text-xs text-gray-400 mt-1">Posted {job.posted}</p>
                </div>

                <div
                  className="flex flex-col items-end gap-2 relative"
                  onMouseEnter={() => setHoveredShare(job.id)}
                  onMouseLeave={() => setHoveredShare(null)}
                >
                  {hoveredShare === job.id ? (
                    <div className="flex gap-2">
                      <FaWhatsapp
                        className="text-green-500 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleWhatsAppShare(job.referLink)}
                      />
                      <FaEnvelope
                        className="text-blue-500 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleEmailShare(job.referLink)}
                      />
                      <FaRegCopy
                        className="text-gray-400 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleShareCopy(job.referLink)}
                      />
                    </div>
                  ) : (
                    <FaShareAlt
                      className="text-gray-400 hover:text-[#102437] cursor-pointer transition"
                    />
                  )}

                  <button
                    onClick={() => setSelectedJob(job)}
                    className={`cursor-pointer border px-4 py-1 rounded-lg text-sm font-medium transition ${
                      selectedJob.id === job.id
                        ? "bg-[#102437] text-white border-[#102437]"
                        : "border-gray-300 hover:bg-[#f1f1f1]"
                    }`}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Job Details */}
{/* Right - Job Details */}
<div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-xl font-bold text-gray-800">{selectedJob.title}</h3>
      <p className="text-sm text-[#F4B472] font-medium">{selectedJob.company}</p>
    </div>

    {/* Share icons with hover functionality */}
    <div
      className="flex items-center gap-2 relative"
      onMouseEnter={() => setHoveredShare(selectedJob.id)}
      onMouseLeave={() => setHoveredShare(null)}
    >
      {hoveredShare === selectedJob.id ? (
        <div className="flex gap-2">
          <FaWhatsapp
            className="text-green-500 cursor-pointer hover:scale-110 transition"
            onClick={() => handleWhatsAppShare(selectedJob.referLink)}
          />
          <FaEnvelope
            className="text-blue-500 cursor-pointer hover:scale-110 transition"
            onClick={() => handleEmailShare(selectedJob.referLink)}
          />
          <FaRegCopy
            className="text-gray-400 cursor-pointer hover:scale-110 transition"
            onClick={() => handleShareCopy(selectedJob.referLink)}
          />
        </div>
      ) : (
        <FaShareAlt
          className="text-gray-400 hover:text-[#102437] cursor-pointer transition"
        />
      )}
    </div>
  </div>

  <div className="mt-6 grid grid-cols-2 text-sm gap-y-2">
    <p><span className="font-medium text-gray-800">Job Type: </span>{selectedJob.jobType}</p>
    <p><span className="font-medium text-gray-800">Work Type: </span>{selectedJob.workType}</p>
    <p><span className="font-medium text-gray-800">Location: </span>{selectedJob.location}</p>
    <p><span className="font-medium text-gray-800">Experience: </span>{selectedJob.experience}</p>
  </div>

  <div className="mt-6">
    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
      {selectedJob.description.map((desc, i) => (
        <li key={i}>{desc}</li>
      ))}
    </ul>
  </div>

  <div className="mt-6">
    <h4 className="font-semibold text-gray-800 mb-2">Requirement</h4>
    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
      {selectedJob.requirement.map((req, i) => (
        <li key={i}>{req}</li>
      ))}
    </ul>
  </div>

  <a
    href={selectedJob.referLink}
    target="_blank"
    rel="noopener noreferrer"
    className="block mt-6 text-center bg-[#102437] text-white font-semibold rounded-xl py-3 hover:bg-[#1d3b5a] transition"
  >
    Refer a Friend
  </a>
    <a
    href={selectedJob.referLink}
    target="_blank"
    rel="noopener noreferrer"
    className="block mt-6 text-center bg-[#102437] text-white font-semibold rounded-xl py-3 hover:bg-[#1d3b5a] transition"
  >
    Apply Now 
  </a>
</div>

      </div>
    </section>
  );
};

export default JobPortal;