import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImageds from "../assets/bgImageds.jpg";
import VendorProjectDropdown from "./VendorProjectDropdown";
import InvoiceDashboard from "./InvoiceDashboard";  
import POBreakdown from "./POBreakdown";
import RecentInvoices from "./RecentInvoices";

const BACKEND_URL = "https://cr1mcdxf-8000.inc1.devtunnels.ms/";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendorName, setVendorName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const vendorEmail = localStorage.getItem("Email");
  const token = localStorage.getItem("authToken");

  // Fetch vendor dashboard data
//   useEffect(() => {
//     const fetchVendorData = async () => {
//       if (!vendorEmail || !token) return;

//       try {
//         const response = await fetch(`${BACKEND_URL}/vendor/dashboard`, {  // ✅ changed endpoint
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ vendor_email: vendorEmail }),  // ✅ updated body
//         });

//         if (!response.ok) throw new Error("Failed to fetch vendor data");

//         const data = await response.json();
//         console.log("Vendor dashboard data:", data);

//         setVendorName(data.vendor_name || "User");  // ✅ updated to vendor_name
//       } catch (error) {
//         console.error("Error fetching vendor data:", error);
//         setVendorName("User");
//       }
//     };

//     fetchVendorData();
//   }, [vendorEmail, token]);

  return (
    <div
      className="lg:col-span-2 space-y-6 p-6 mt-0.1 overflow-y-auto bg-cover bg-center bg-no-repeat -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 mt-[5rem]">
        {/* LEFT – Welcome Message */}
        <div className="text-[#102437] font-semibold text-[26px]">
          Welcome back, <span className="font-bold">First Up Consultant</span>
        </div>
      </div>

      {/* Project Section */}
      <div>
        <VendorProjectDropdown onProjectSelect={setSelectedProject} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <RecentInvoices />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col md:flex-col gap-6">
          <div className="flex-1">
            <InvoiceDashboard />
          </div>

          <div className="flex-1">
            <POBreakdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;