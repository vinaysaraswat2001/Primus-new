import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaUpload,
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaChevronDown,
  FaDownload,
} from "react-icons/fa";
import bgImageds from "../../assets/bgImageds.jpg";
// import Bg from "../../assets/Bg.png"
// --------------------- Sample Data ---------------------
const folders = [
  { name: "Project documents", files: 10, subfolders: 2 },
  { name: "Legal documents", files: 10, subfolders: 2 },
  { name: "Financial documents", files: 10, subfolders: 2 },
  { name: "Primus Documents", files: 10, subfolders: 2 },
];
 
const initialFiles = [
 
  {
    name: "Team Plan",
    location: "Projects",
    type: ".doc",
    important: false,
    modified: "2025-09-23",
    url: "/sample-files/teamplan.doc",
  },
  {
    name: "Budget Sheet",
    location: "Finance",
    type: ".xls",
    important: true,
    modified: "2025-09-25",
    url: "/sample-files/budget.xls",
  },
  {
    name: "Design Assets",
    location: "UI",
    type: "folder",
    important: false,
    modified: "2025-09-26",
    url: "",
  },
];
 
// --------------------- Dropdown Options ---------------------
const tableOptions = {
  Location: ["Personal documents", "Projects", "Finance", "UI", "Uploaded"],
  "File type": [".pdf", ".doc", ".xls", "folder"],
  // Modified: ["Today", "This week", "This month"],
};
 
// -------------------------------------------------------
export default function DocumentLibrary() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All files");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    Location: "Location",
    "File type": "File type",
    Modified: "Modified",
  });
  const [fileList, setFileList] = useState(initialFiles);
 
  // ---------- Filtering logic ----------
  const filteredFiles = useMemo(() => {
    const now = new Date();
    let result = fileList;
 
    // Filter by selected dropdowns
    Object.keys(selectedOptions).forEach((key) => {
      const value = selectedOptions[key];
      if (value !== key) {
        if (key === "Location") result = result.filter((f) => f.location === value);
        if (key === "File type") result = result.filter((f) => f.type === value);
      }
    });
 
    // Filter by search
    result = result.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
 
    // Filter by tabs
    switch (activeTab) {
      case "Files and folders":
        return result.filter(
          (f) => f.type === "folder" || [".pdf", ".doc", ".xls"].includes(f.type)
        );
      case "Important":
        return result.filter((f) => f.important);
      case "Recent":
        return result.filter((f) => {
          const diff = (now - new Date(f.modified)) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        });
      default:
        return result;
    }
  }, [search, activeTab, selectedOptions, fileList]);
 
  // ---------- Toggle Important ----------
  const toggleImportant = (index) => {
    const updatedFiles = [...fileList];
    updatedFiles[index].important = !updatedFiles[index].important;
    setFileList(updatedFiles);
  };
 
  // ---------- Download File ----------
  const downloadFile = (file) => {
    if (!file.url) return;
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name + file.type;
    link.click();
  };
 
  // ---------- Upload File ----------
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    const newFile = {
      name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
      type: "." + file.name.split(".").pop(),
      location: "Uploaded",
      important: false,
      modified: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(file),
    };
 
    setFileList((prev) => [newFile, ...prev]);
  };
 
  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6 mt-[5rem]"
 
      >
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">
            Your folders | <span className="font-normal">24 Folders</span>
          </h1>
          <span className="text-sm text-gray-500">
            Click on a folder to view the files / Sub folders inside
          </span>
        </div>
 
          {/* <label className="cursor-pointer flex items-center gap-2 bg-white text-black px-4 py-2 rounded-4xl shadow hover:shadow-md transition">
            <FaUpload />
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
          </label> */}
             <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 w-56 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>
 
      {/* ===== Folder Grid ===== */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {folders.map((folder, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow hover:shadow-md transition p-6 flex flex-col items-center"
          >
            <div className="bg-gray-100 p-6 rounded-2xl mb-4 flex items-center justify-center">
              <FaFolder className="text-6xl text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 text-center">{folder.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {folder.files} Files | {folder.subfolders} Folders
            </p>
          </div>
        ))}
      </div> */}
 
      {/* ===== Filters + Search ===== */}
     
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-white/100 backdrop-blur-sm rounded-xl p-4 shadow-sm"    >
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">
            Your files | <span className="font-normal">{fileList.length} Items</span>
          </h1>
          <span className="text-sm text-gray-500">Click on a file to preview the file</span>
        </div>
 
        {/* Dropdowns */}
        <div className="flex gap-2">
          {Object.keys(tableOptions).map((label) => (
            <div key={label} className="relative w-60 z-[20]">
              <button
                className="flex items-center justify-between border border-gray-200 bg-white rounded-lg px-4 py-2 text-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                onClick={() =>
                  setOpenDropdown(openDropdown === label ? null : label)
                }
              >
                {selectedOptions[label]}
                <FaChevronDown
                  className={`ml-2 transition-transform duration-300 ${openDropdown === label ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>
 
              {openDropdown === label && (
                <ul className="absolute top-full left-0 w-full mt-1  bg-white border border-gray-200 rounded-lg shadow-lg z-[99999999] max-h-56 overflow-y-auto">
                  {tableOptions[label].map((option) => (
                    <li
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedOptions((prev) => ({ ...prev, [label]: option }));
                        setOpenDropdown(null);
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
 
        {/* Search */}
        {/* <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 w-56 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div> */}
      </div>
 
      {/* ===== Tabs ===== */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {["All files", "Files and folders", "Important", "Recent"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-3 text-gray-600 relative transition
              after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-500 after:scale-x-0 after:origin-left after:transition-transform
              ${activeTab === tab
                ? "text-indigo-600 font-semibold after:scale-x-100"
                : "hover:text-indigo-600 hover:after:scale-x-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
 
      {/* ===== Files Table ===== */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="bg-white w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">File name</th>
              <th className="p-4 font-medium">Location (Folder)</th>
              <th className="p-4 font-medium">File type</th>
              <th className="p-4 font-medium">Important</th>
              <th className="p-4 font-medium">Modified</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 flex items-center gap-2">
                    {file.type === ".pdf" && <FaFilePdf className="text-red-500 text-lg" />}
                    {file.type === ".doc" && <FaFileWord className="text-blue-500 text-lg" />}
                    {file.type === ".xls" && <FaFileExcel className="text-green-600 text-lg" />}
                    {file.type === "folder" && (
                      <FaFolder className="bg-gray-100 p-2 rounded text-2xl text-gray-400" />
                    )}
                    {file.name}
                  </td>
                  <td className="p-4 text-gray-500">{file.location}</td>
                  <td className="p-4 text-gray-500">{file.type}</td>
                  <td className="p-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={file.important}
                        onChange={() => toggleImportant(fileList.indexOf(file))}
                        className="sr-only peer z-60"
                      />
                      <div
                        className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-500 relative
                          after:content-[''] after:absolute after:top-0.5 after:left-0.5
                          after:bg-white after:border after:rounded-full after:h-4 after:w-4
                          after:transition-all peer-checked:after:translate-x-5"
                      />
                    </label>
                  </td>
                  <td className="p-4 text-gray-500">{file.modified}</td>
                  <td className="pl-[2rem]">
                    {file.type !== "folder" && file.url && (
                      <button
                        onClick={() => downloadFile(file)}
                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                      >
                        <FaDownload />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400 italic">
                  No files found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
 