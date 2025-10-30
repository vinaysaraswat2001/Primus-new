import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaFileInvoice } from "react-icons/fa";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://cr1mcdxf-8000.inc1.devtunnels.ms/";

const RecentInvoices = () => {
  const [filter, setFilter] = useState("All");
  const [invoices, setInvoices] = useState([]);
  const hasFetched = useRef(false); // 🧠 Prevents duplicate API calls

  const token = localStorage.getItem("authToken");
  const vendorEmail = localStorage.getItem("Email");

  // Fetch invoices from API — only once per session
  useEffect(() => {
    const fetchInvoices = async () => {
      if (hasFetched.current || !token || !vendorEmail) return;
      hasFetched.current = true; // ✅ ensure it runs only once

      try {
        const response = await axios.post(
          `${BASE_URL}/vendor/invoice-orders-dashboard`,
          { vendor_email: vendorEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setInvoices(response.data.invoices || []);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }
    };

    fetchInvoices();
  }, [token, vendorEmail]);

  // Filtering
  const filteredInvoices =
    filter === "All"
      ? invoices
      : invoices.filter((inv) => {
          if (filter === "Completed") return inv.status === "completed";
          if (filter === "Overdue") return inv.overdue === true;
          return true;
        });

  const statusColor = (status, overdue) => {
    if (overdue) return "text-red-500";
    if (status === "completed") return "text-green-600";
    return "text-gray-600";
  };

  const iconBorder = (status, overdue) =>
    overdue ? "border-red-500 text-red-500" : "border-green-500 text-green-500";

  return (
    <div className="bg-gradient-to-b from-white to-amber-50 rounded-3xl shadow-md p-6 w-full max-w-5xl h-[50.8rem] mx-auto overflow-hidden overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Invoices</h2>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full text-sm font-medium overflow-hidden">
          {["All", "Completed", "Overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`cursor-pointer px-4 py-1 transition-all ${
                filter === tab
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-sm font-medium text-gray-500 border-b pb-2 mb-2 mt-[2rem]">
        <p>Vendor Invoice</p>
        <p className="text-center">Due Date</p>
        <p className="text-center">Amount</p>
        <p className="text-right">Status</p>
      </div>

      {/* Table Body */}
      <div className="space-y-3">
        {filteredInvoices.map((inv, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 items-center text-sm py-2 border-b last:border-none"
          >
            {/* Vendor Invoice */}
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border ${iconBorder(
                  inv.status,
                  inv.overdue
                )}`}
              >
                <FaFileInvoice />
              </span>
              <p className="font-medium text-gray-800">{inv.vendorInvoiceNo}</p>
            </div>

            {/* Due Date */}
            <p
              className={`text-center ${
                inv.overdue ? "text-red-500 font-medium" : "text-gray-600"
              }`}
            >
              {new Date(inv.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {/* Amount */}
            <p className="text-center text-gray-800 font-medium">
              ₹{inv.amountIncludingVAT.toLocaleString()}
            </p>

            {/* Status */}
            <p
              className={`text-right font-semibold ${statusColor(
                inv.status,
                inv.overdue
              )}`}
            >
              {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentInvoices;
