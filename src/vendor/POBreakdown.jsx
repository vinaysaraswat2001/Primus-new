import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://cr1mcdxf-8000.inc1.devtunnels.ms/";

export default function POBreakdown() {
  const [departments, setDepartments] = useState([]); // fetched PO breakdown
  const [open, setOpen] = useState(false); // 3-dot menu
  const [showModal, setShowModal] = useState(false); // full modal
  const menuRef = useRef(null);
  const printRef = useRef(null);

  const token = localStorage.getItem("authToken");
  const vendorEmail = localStorage.getItem("Email");

  // Fetch PO breakdown data
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !vendorEmail) return;

      try {
        const response = await axios.post(
          `${BASE_URL}/vendor/purchase-orders-dashboard`,
          { vendor_email: vendorEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const poData = response.data.po_breakdown || [];
        // Map API fields to table fields
        const mappedDepartments = poData.map((item) => ({
          name: item.posting_group,
          qty: item.quantity,
          amount: item.total_amount,
        }));

        setDepartments(mappedDepartments);
      } catch (error) {
        console.error("Failed to fetch PO breakdown:", error);
        setDepartments([]);
      }
    };
    fetchData();
  }, [token, vendorEmail]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Download (placeholder)
  const handleDownload = () => {
    alert("Downloading PO breakdown...");
    setOpen(false);
  };

  // Print full table
  const handlePrint = () => {
    const fullTableHTML = `
      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <thead>
          <tr style="background-color:#f2f2f2; text-align:left;">
            <th style="border:1px solid #ddd; padding:8px;">Category</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:center;">Qty</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${departments
            .map(
              (dept) => `
                <tr>
                  <td style="border:1px solid #ddd; padding:8px;">${dept.name}</td>
                  <td style="border:1px solid #ddd; padding:8px; text-align:center;">${dept.qty}</td>
                  <td style="border:1px solid #ddd; padding:8px; text-align:right;">₹${dept.amount.toLocaleString()}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>PO Breakdown</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>PO Breakdown</h2>
          ${fullTableHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setOpen(false);
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-white to-amber-50 rounded-3xl shadow-md p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-gray-900 font-semibold text-base">PO Breakdown</h2>
          <p className="text-gray-500 text-sm">PO Breakdown by Category</p>
        </div>

        {/* 3-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fadeIn">
              <button onClick={handleDownload} className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                ⬇️ Download
              </button>
              <button onClick={handlePrint} className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                🖨️ Print
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
<div
  ref={printRef}
  className="h-[230px] overflow-y-auto scrollbar-hide"
>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 font-medium border-b">
              <th className="text-left py-2">Category</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(departments) && departments.slice(0, 6).map((dept, idx) => (
              <tr key={idx} className="hover:bg-amber-50/60 transition">
                <td className="text-gray-800 font-medium py-2">{dept.name}</td>
                <td className="text-center text-gray-700">{dept.qty}</td>
                <td className="text-right text-gray-900 font-semibold">₹{dept.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View More Button */}
      <div className="mt-5">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer w-full py-2 text-center font-medium rounded-xl bg-gray-300 text-gray-700 hover:bg-gray-200 transition"
        >
          View more
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="p-[2rem] bg-white rounded-4xl shadow-lg w-200 max-h-[80vh] overflow-y-auto relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Full PO Breakdown</h3>
            <div className="overflow-y-auto max-h-[300px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-sm border border-gray-200">
                <thead>
                  <tr className="text-gray-500 font-medium bg-gray-100">
                    <th className="text-left py-4 px-4">Category</th>
                    <th className="text-center py-4 px-4">Qty</th>
                    <th className="text-right py-4 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, idx) => (
                    <tr key={idx} className="hover:bg-amber-50 transition border-t border-gray-200">
                      <td className="text-gray-800 font-medium py-1 px-4">{dept.name}</td>
                      <td className="text-center text-gray-700 py-4 px-4">{dept.qty}</td>
                      <td className="text-right text-gray-900 font-semibold py-4 px-4">₹{dept.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowModal(false)} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg">✖</button>
          </div>
        </div>
      )}
    </div>
  );
}
