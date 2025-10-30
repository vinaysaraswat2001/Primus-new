import React from "react";

// Example data
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const invoiceData = [
  { paid: 60, unpaid: 70 },
  { paid: 95, unpaid: 65 },
  { paid: 40, unpaid: 25 },
  { paid: 80, unpaid: 45 },
  { paid: 20, unpaid: 10 },
  { paid: 30, unpaid: 55 },
  { paid: 75, unpaid: 40 },
];

const InvoiceActivity = () => {
  const maxValue = Math.max(
    ...invoiceData.flatMap(d => [d.paid, d.unpaid])
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Invoice Activity</h2>
          <p className="text-sm text-gray-500">Invoice Timeline Overview</p>
        </div>
        <button className="text-sm text-blue-600 hover:underline bg-gray-200 p-4 rounded-2xl cursor-pointer">
          Download Report
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-64 flex items-end border-t border-gray-200">
        {invoiceData.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center mx-1">
            <div className="flex items-end gap-1 h-full justify-center">
              {/* Paid bar */}
              <div
                className="w-4 rounded-t-md bg-green-500"
                style={{ height: `${(d.paid / maxValue) * 100}%` }}
                title={`Paid: ₹${d.paid * 100}`}
              />
              {/* Unpaid bar */}
              <div
                className="w-4 rounded-t-md bg-red-500"
                style={{ height: `${(d.unpaid / maxValue) * 100}%` }}
                title={`Unpaid: ₹${d.unpaid * 100}`}
              />
            </div>
            <span className="mt-2 text-sm text-gray-700">{days[i]}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="text-sm text-gray-700">Paid</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="text-sm text-gray-700">Unpaid</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceActivity;