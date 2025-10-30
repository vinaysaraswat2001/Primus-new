import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdDownload } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { saveAs } from "file-saver";
import bgImageds from "../../assets/bgImageds.jpg";
import printer from '../../assets/printer.png'

import {
  fetchProjectDocuments,
  selectDocumentsByProject,
  selectDocumentStatusByProject,
  selectDocumentErrorByProject,
} from "../../redux/documentlibrarySlice";
import { selectSelectedProjectId } from "../../redux/projectSlice";
import histroherobg from '../../assets/histroherobg.png';

const DocumentLibraryWorking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
const [showPreviewModal, setShowPreviewModal] = useState(false);


  const dispatch = useDispatch();
  // const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedProjectId = "PR00250"
  const documents = useSelector(selectDocumentsByProject(selectedProjectId));
  const docStatus = useSelector(selectDocumentStatusByProject(selectedProjectId));
  const docError = useSelector(selectDocumentErrorByProject(selectedProjectId));

  // Fetch documents when project changes or status fails
  useEffect(() => {
    if (selectedProjectId && (docStatus === "idle" || docStatus === "failed")) {
      dispatch(fetchProjectDocuments(selectedProjectId));
    }
  }, [dispatch, selectedProjectId, docStatus]);



  const handleDownload = async (projectId, fileName) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/client/project/${projectId}/document-attachments/content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ file_name: fileName }),

        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
      alert("❌ Error downloading file");
    }
  };

  // Filter documents based on search input
  const filteredDocuments = documents.filter((doc) =>
    [doc.file_name, doc.no, doc.fileType]
      .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="p-6 mt-[8rem]">
        <div className="rounded-2xl  overflow-y-auto">

          <div className="flex items-center justify-between h-18 w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${histroherobg})` }} >
            <div className="flex flex-col text-left  p-5 rounded-3xl">

              <h2 className="text-xl  text-center font-semibold text-gray-900"   >

                Your files  |  {documents.length} Files
              </h2>
              <p className="text-xs pl-4 text-[#676767]">Click on a file to download the file</p>
            </div>
            <div className="flex items-center px-7 gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-80 border-gray-400 ">
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

          {/* Handle Loading, Error, and Empty States */}
          {docStatus === "loading" && (
            // <p className="text-gray-500 text-center py-4">Loading documents...</p>
            <div className="flex justify-center bg-white items-center h-[59vh] w-full">
              <p className="text-gray-500 text-lg font-medium animate-pulse">Loading documents...</p>
            </div>
          )}
          {docStatus === "failed" && (
            <p className="text-red-500 text-center py-4">
              Error: {docError || "Failed to load documents"}
            </p>
          )}
          {docStatus === "succeeded" && documents.length === 0 && (
            // <p className="text-gray-500 text-center py-4">No documents found.</p>
            <div className="flex justify-center bg-white items-center  h-[59vh] w-full">
              <p className="text-gray-500 text-lg font-medium animate-pulse">No documents found.</p>
            </div>
          )}

          {docStatus === "succeeded" && documents.length > 0 && (
            <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-sm  overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-6 gap-4 py-3 px-10 bg-gray-50 text-sm font-semibold text-gray-700 border-b">
                <div>File Name</div>
                <div>Project No.</div>
                <div>File Type</div>
                <div>Created Date</div>
                <div>Modified Date</div>
                <div className="text-center">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y max-h-[65vh] overflow-y-auto custom-scroll">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id || doc.file_id}
                    className="grid grid-cols-6 gap-4 px-10 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors items-center"
                  >
                    <div className="truncate">{doc.file_name}</div>
                    <div>{doc.no}</div>
                    <div>{doc.fileType}</div>
                    <div>{new Date(doc.createdDate).toLocaleDateString()}</div>
                    <div>{new Date(doc.modifiedDate).toLocaleDateString()}</div>
                    <div className="text-center flex flex-row items-center justify-center gap-6">
                      <button
                        onClick={() => handleDownload(selectedProjectId, doc.file_name)}
                        className="text-black cursor-pointer"
                        title="Download File"
                      >
                        <IoMdDownload className="inline-block h-5 w-5" />

                      </button>
                      {/* <img src = {printer} className="h-5 w-5"/> */}
                      <button
  onClick={() => {
    setPreviewDoc(doc);   // store the document to preview
    setShowPreviewModal(true); // show the modal
  }}
  title="Preview Document"
>
  <img src={printer} className="h-5 w-5 cursor-pointer" />
</button>

                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
          {showPreviewModal && previewDoc && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl relative">
      
      <button
        onClick={() => setShowPreviewModal(false)}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
      >
        X
      </button>

      <h3 className="text-lg font-semibold mb-4">{previewDoc.file_name}</h3>

      {previewDoc.fileType === "pdf" ? (
        <iframe
          src={previewDoc.file_url} // PDF URL
          className="w-full h-[70vh] border rounded"
        />
      ) : previewDoc.fileType.startsWith("image") ? (
        <img
          src={previewDoc.file_url}
          alt={previewDoc.file_name}
          className="w-full h-auto max-h-[70vh] object-contain rounded"
        />
      ) : ["docx", "xlsx", "pptx"].includes(previewDoc.fileType) ? (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewDoc.file_url)}`}
          width="100%"
          height="70vh"
          className="border rounded"
        />
      ) : (
        <p className="text-gray-600">Preview not available for this file type.</p>
      )}
    </div>
  </div>
)}


        </div>
      </div>
    </div >
  );
};

export default DocumentLibraryWorking;
