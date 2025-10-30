import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeline } from "../../redux/projectTimelineSlice";
import { selectSelectedProjectId } from "../../redux/projectSlice";

ChartJS.register(ArcElement, Tooltip);

function PaymentsOverview() {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(selectSelectedProjectId);

  // Get timeline and status from Redux
  const timeline = useSelector(
    (state) => state.timeline.timelines[selectedProjectId]
  );
  const status = useSelector(
    (state) => state.timeline.status[selectedProjectId]
  );

  // Fetch timeline only if it doesn't exist yet
  useEffect(() => {
    if (selectedProjectId && !timeline) {
      dispatch(fetchTimeline(selectedProjectId));
    }
  }, [dispatch, selectedProjectId, timeline]);

  // --- Early returns ---
  if (!selectedProjectId) {
    return (
      <div className="text-center py-10 text-gray-500">
        Select a project to view payment details.
      </div>
    );
  }

  if (!timeline && status === "loading") {
    return (
      <div className="flex min-h-[59vh] w-[30vw] bg-white rounded-4xl justify-center items-center">
        <p className="text-gray-500 text-lg font-medium animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="text-center py-10 text-gray-400">
        No timeline data available for this project.
      </div>
    );
  }

  // --- Payment calculations ---
  const completedAmount = timeline.phases.reduce(
    (sum, p) => sum + (p.completedAmount || 0),
    0
  );
  const pendingAmount = timeline.phases.reduce(
    (sum, p) => sum + (p.remainingAmount || 0),
    0
  );
  const totalBilling = timeline.phases.reduce(
    (sum, p) => sum + (p.actualBillingAmount || 0),
    0
  );

  const completedPercent =
    totalBilling === 0 ? 0 : ((completedAmount / totalBilling) * 100).toFixed(2);

  // --- Half-donut chart ---
  const chartData = {
    datasets: [
      {
        data: [completedAmount, pendingAmount],
        backgroundColor: ["#F4B472", "#E5E7EB"],
        borderWidth: 0,
        cutout: "70%",
        circumference: 180, // Half circle
        rotation: 270,      // Start from bottom
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} CR`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(2)} L`;
    return amount.toLocaleString("en-IN");
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl h-[65vh] shadow-sm border border-gray-100 p-6 max-w-md mx-auto space-y-5">
      <h2 className="text-2xl font-semibold text-gray-900">Payments Overview</h2>

      <div className="relative w-full h-55 flex justify-center items-end">
        <div className="w-80 h-64">
          <Doughnut data={chartData} options={chartOptions} />

          {/* Center label */}
          <div className="absolute bottom-10 text-center w-full">
            <div className="text-[#F4B472] font-semibold text-xl">
              {completedPercent}%
            </div>
            <div className="text-[#667085] text-md">Completed</div>
          </div>
        </div>
      </div>

      {/* Completed & Pending amounts */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
        <div className="text-center">
          <div className="text-[#667085] text-base">Completed payment</div>
          <div className="text-black text-base font-semibold">
            {formatAmount(completedAmount)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#667085] text-base">Pending payment</div>
          <div className="text-black text-base font-semibold">
            {formatAmount(pendingAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentsOverview;
