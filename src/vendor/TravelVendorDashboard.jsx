import React from "react";
import { Upload, Clock, CheckCircle, Plane, FileCheck } from "lucide-react";

const TravelVendorDashboard = () => {

  const stats = [
    {
      title: "Total Trips",
      value: 48,
      icon: <Plane size={22} />,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      title: "Pending Approvals",
      value: 12,
      icon: <Clock size={22} />,
      color: "bg-orange-50 border-orange-200 text-orange-700",
    },
    {
      title: "Approved Trips",
      value: 28,
      icon: <CheckCircle size={22} />,
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      title: "Completed Trips",
      value: 8,
      icon: <FileCheck size={22} />,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
  ];

  const trips = [
    {
      vendor: "Acme Supplies Co.",
      purpose: "Client Meeting",
      city: "New Delhi, India",
      dateRange: "2025-11-05 to 2025-11-07",
      status: "Approved",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      vendor: "TechPro Solutions",
      purpose: "Conference Attendance",
      city: "Mumbai, Maharashtra",
      dateRange: "2025-11-12 to 2025-11-15",
      status: "Pending",
      statusColor: "bg-orange-100 text-orange-700",
    },
    {
      vendor: "Global Trade Inc.",
      purpose: "Site Inspection",
      city: "Pune, Maharashtra",
      dateRange: "2025-10-20 to 2025-10-22",
      status: "Reimbursed",
      statusColor: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-50">

      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#102437] flex items-center gap-3">
            <Plane className="text-blue-600" /> Vendor Travel Dashboard
          </h1>
          <p className="text-gray-500">
            Manage and track vendor travel requests and expenses
          </p>
        </div>

        {/* <button className="px-5 py-2 bg-white border shadow-sm rounded-xl hover:bg-gray-100 flex items-center gap-2">
          <Upload size={18} />
          Upload Documents
        </button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {stats.map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl border ${card.color} flex justify-between items-center`}
          >
            <div>
              <p className="font-semibold">{card.title}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div className="opacity-70">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Travel Logs */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#102437]">Recent Travel Logs</h2>
        <p className="text-gray-500">View and track recent vendor travel requests</p>
      </div>

      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="p-5 bg-white border border-blue-200 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{trip.vendor}</h3>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${trip.statusColor}`}
              >
                {trip.status}
              </span>
            </div>

            <p className="text-gray-600">{trip.purpose}</p>

            <div className="flex items-center gap-6 text-gray-500 mt-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17.657 16.657A8 8 0 016.343 5.343m11.314 11.314L21 21M8 9h.01M16 9h.01M12 9h.01" />
                </svg>
                {trip.city}
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7H3v10a2 2 0 002 2z" />
                </svg>
                {trip.dateRange}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TravelVendorDashboard;
