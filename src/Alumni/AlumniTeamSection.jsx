import React, { useState } from "react";
import bgImageds from "./bgImageds.jpg";

const allTeamMembers = [
  {
    name: "Vinay Saraswat",
    role: "Associate Data Scientist",
    description:
      "Delivers practical project delivery support and collaborates with clients to build strong project foundations.",
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&q=80",
    summary:
      "Passionate about storytelling and project strategy. Expert in aligning clients toward successful execution and delivery excellence.",
    tools: ["Java", "Postman", "GitHub", "VS Code", "Jira"],
    experience: [
      { title: "Software Developer", company: "xyz Company Pvt. Ltd", years: "2025–Present" },
      { title: "Associate Director", company: "xyz Group Ltd", years: "2020–2025" },
    ],
    education: [
      { degree: "BSc in Computer Science", school: "XYZ College", years: "2014–18" },
    ],
    projects: [
      { name: "E-commerce Platform", duration: "6 Months" },
      { name: "Data Modernization", duration: "8 Months" },
    ],
    email: "vinay.saraswat@onmeridian.com",
    phone: "+91-9898765432",
    resume: "#",
  },
  {
    name: "Harsh Bhardwaj",
    role: "Frontend Developer",
    description:
      "Leads project teams and ensures timely delivery of objectives with high-quality standards.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    summary: "Expert in Agile project management and client communication.",
    tools: ["Trello", "Slack", "Jira", "Confluence"],
    experience: [
      { title: "Project Coordinator", company: "ABC Pvt. Ltd", years: "2021–2023" },
      { title: "Project Manager", company: "XYZ Group Ltd", years: "2023–Present" },
    ],
    education: [
      { degree: "MBA in Project Management", school: "ABC University", years: "2018–20" },
    ],
    projects: [
      { name: "ERP Implementation", duration: "5 Months" },
      { name: "CRM Integration", duration: "4 Months" },
    ],
    email: "harsh.bhardwaj@onmeridian.com",
    phone: "+91-9876543210",
    resume: "#",
  },
  {
    name: "Garvit Dang",
    role: "Software Engineer",
    description:
      "Develops scalable web applications and maintains technical documentation.",
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=500&q=80",
    summary: "Focused on backend development and cloud infrastructure.",
    tools: ["Node.js", "React", "AWS", "Docker", "GitHub"],
    experience: [
      { title: "Junior Developer", company: "TechSoft Ltd", years: "2020–2022" },
      { title: "Software Engineer", company: "XYZ Group Ltd", years: "2022–Present" },
    ],
    education: [
      { degree: "B.Tech in Computer Science", school: "Tech University", years: "2015–19" },
    ],
    projects: [
      { name: "Inventory Management System", duration: "6 Months" },
    ],
    email: "garvit.dang@onmeridian.com",
    phone: "+91-9988776655",
    resume: "#",
  },
  {
    name: "Rafik Mohammed",
    role: "UX/UI Designer",
    description: "Provides expert advice and technical support remotely.",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80",
    summary: "Remote consultant specializing in cloud solutions and integrations.",
    tools: ["AWS", "GCP", "Slack", "Zoom"],
    experience: [
      { title: "Cloud Engineer", company: "Cloudify Ltd", years: "2019–2022" },
      { title: "Consultant", company: "XYZ Group Ltd", years: "2022–Present" },
    ],
    education: [
      { degree: "MSc in Information Systems", school: "Tech University", years: "2016–18" },
    ],
    projects: [
      { name: "Cloud Migration", duration: "3 Months" },
      { name: "API Integration", duration: "2 Months" },
    ],
    email: "rafik.mohammed@onmeridian.com",
    phone: "+91-9123456789",
    resume: "#",
  },
];


export default function TeamMembers() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div
      className="-mt-[5rem] bg-cover bg-center bg-no-repeat bg-slate-50 min-h-screen py-8 px-4 sm:px-8"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="mt-[5rem] flex justify-between items-center mb-8">
<h1 className="text-2xl font-semibold text-gray-800">Employees Directory</h1>
        <input
          type="search"
          placeholder="Search..."
          className="bg-white border border-gray-400 rounded-3xl px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="bg-white p-5 rounded-3xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {allTeamMembers.map((member, i) => (
            <div
              key={i}
              onClick={() => setSelectedMember(member)}
              className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-gray-900 font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 leading-snug">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl mx-4 rounded-xl shadow-lg overflow-hidden relative flex flex-col md:flex-row">
            {/* Left section */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col items-center justify-center">
              <button
                className="cursor-pointer absolute top-4 left-4 text-gray-500 hover:text-black"
                onClick={() => setSelectedMember(null)}
              >
                ←
              </button>

              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{selectedMember.name}</h2>
              <p className="text-sm text-gray-600 text-center">{selectedMember.role}</p>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>{selectedMember.email}</p>
                <p>{selectedMember.phone}</p>
              </div>

              <button
                className="mt-6 w-full py-2 rounded-3xl text-white"
                style={{ backgroundColor: "#102437" }}
              >
                Download Resume
              </button>
            </div>

            {/* Right section */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-sm text-gray-600 mb-4">{selectedMember.summary}</p>

              <h3 className="text-lg font-semibold mb-2">Tools and Technology</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMember.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              {selectedMember.experience.map((exp, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm font-medium text-gray-800">{exp.title}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.years}</p>
                </div>
              ))}

              <h3 className="text-lg font-semibold mt-4 mb-2">Education</h3>
              {selectedMember.education.map((edu, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.years}</p>
                </div>
              ))}

              <h3 className="text-lg font-semibold mt-4 mb-2">Projects</h3>
              {selectedMember.projects.map((proj, idx) => (
                <div key={idx} className="mb-1 flex justify-between">
                  <p className="text-sm text-gray-700">{proj.name}</p>
                  <p className="text-xs text-gray-500">{proj.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
