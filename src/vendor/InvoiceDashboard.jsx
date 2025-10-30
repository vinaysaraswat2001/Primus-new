import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://cr1mcdxf-8000.inc1.devtunnels.ms/";

const InvoiceDashboard = () => {
  const [data, setData] = useState({
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    stats: [
      { label: "Total invoices", value: 0, percent: 100, color: "#0d1b2a" },
      { label: "Paid invoices", value: 0, percent: 0, color: "#0d1b2a" },
      { label: "Pending invoices", value: 0, percent: 0, color: "#0d1b2a" },
      { label: "Overdue invoices", value: 0, percent: 0, color: "#e11d48" },
    ],
  });

  const token = localStorage.getItem("authToken");
  const vendorEmail = localStorage.getItem("Email");

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!token || !vendorEmail) return;

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

        const res = response.data;

        setData({
          totalAmount: res.total_amount || 0,
          approvedAmount: res.approved_amount || 0,
          pendingAmount: res.pending_amount || 0,
          overdueAmount: res.overdue_amount || 0,
          stats: [
            { label: "Total invoices", value: res.total_invoices, percent: 100, color: "#0d1b2a" },
            { label: "Paid invoices", value: res.paid_invoices, percent: res.paid_invoices_percent, color: "#0d1b2a" },
            { label: "Pending invoices", value: res.pending_invoices, percent: res.pending_invoices_percent, color: "#0d1b2a" },
            { label: "Overdue invoices", value: res.overdue_invoices, percent: res.overdue_invoices_percent, color: "#e11d48" },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch invoice dashboard:", err);
      }
    };

    fetchInvoiceData();
  }, [token, vendorEmail]);

  const Circle = ({ value, percent, color }) => {
    const radius = 40;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (percent / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span className="absolute text-lg font-semibold text-gray-900">{value}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Amount of Invoices</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="flex">
  {/* LEFT COLUMN */}
  <div className="relative pl-4">
    {/* Full vertical line */}
    <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-[#102437]"></div>

    {/* Items */}
    <div className="space-y-6 relative z-10">
      <div className="pl-4">
        <p className="text-gray-600 font-medium">Total Amount</p>
        <p className="text-gray-900 font-bold text-lg">
          ₹{data.totalAmount.toLocaleString()}
        </p>
      </div>

      <div className="pl-4">
        <p className="text-gray-600 font-medium">Paid Amount</p>
        <p className="text-gray-900 font-bold text-lg">
          ₹{data.approvedAmount.toLocaleString()}
        </p>
      </div>

      <div className="pl-4">
        <p className="text-gray-600 font-medium">Pending Amount</p>
        <p className="text-gray-900 font-bold text-lg">
          ₹{data.pendingAmount.toLocaleString()}
        </p>
      </div>

      <div className="pl-4">
        <p className="text-gray-600 font-medium">Overdue Amount</p>
        <p className="text-red-600 font-bold text-lg">
          ₹{data.overdueAmount.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
</div>
        {/* RIGHT COLUMN */}
        <div className="grid grid-cols-2 gap-4 -mt-[3rem]">
          {data.stats.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-[#f9f8f3] rounded-2xl shadow-sm py-3"
            >
              <Circle
                value={item.value}
                percent={item.percent}
                color={item.color}
              />
              <span className="text-gray-800 text-sm text-center mt-2 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
