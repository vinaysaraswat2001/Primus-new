import React, { useState, useEffect } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoiceData } from "../redux/invoiceSlice"; // ✅ adjust import path

const RecentInvoices = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("All");

  // ✅ Pull data from Redux store
  const { data, loading, error } = useSelector((state) => state.invoices);

  // ✅ Prevent loader if data already exists
  useEffect(() => {
    if (!data || !data.invoices || data.invoices.length === 0) {
      dispatch(fetchInvoiceData());
    }
  }, [dispatch, data]);

  // ✅ Handle empty/error cases safely
  const invoices = data?.invoices || [];

  // ✅ Filter logic
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

      {/* Loader */}
      {loading && (!data || !data.invoices || data.invoices.length === 0) && (
        <div className="text-center text-gray-500 py-8">Loading invoices...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 py-8">
          Failed to load invoices: {error}
        </div>
      )}

      {/* Table Body */}
      {!loading && filteredInvoices.length > 0 ? (
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
                <p className="font-medium text-gray-800">
                  {inv.vendorInvoiceNo}
                </p>
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
                ₹{inv.amountIncludingVAT?.toLocaleString()}
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
      ) : (
        !loading &&
        !error &&
        filteredInvoices.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No invoices found.
          </div>
        )
      )}
    </div>
  );
};

export default RecentInvoices;