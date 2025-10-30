import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa";
import img1 from '../../assets/payment1.png';
import img2 from '../../assets/payment2.png';
import img3 from '../../assets/payment3.png';
import img4 from '../../assets/payment4.png';
import { fetchTimeline } from "../../redux/projectTimelineSlice";
import { selectSelectedProjectId, selectSelectedProjectData } from "../../redux/projectSlice";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function InvoiceDetails() {
    const dispatch = useDispatch();
    const selectedProjectId = useSelector(selectSelectedProjectId);
    const projectData = useSelector(selectSelectedProjectData);

    // Get timeline and status from Redux for the selected project
    const timeline = useSelector(state => state.timeline.timelines[selectedProjectId]);
    const status = useSelector(state => state.timeline.status[selectedProjectId]);

    // Fetch timeline only if it does not exist yet
    useEffect(() => {
        if (selectedProjectId && !timeline) {
            dispatch(fetchTimeline(selectedProjectId));
        }
    }, [dispatch, selectedProjectId, timeline]);

    // --- Early returns ---
    if (!selectedProjectId) {
        return (
            <div className="text-center py-10 text-gray-500">
                Select a project to view invoice details.
            </div>
        );
    }

    if (!timeline && status === "loading") {
        return (
            <div className="flex min-h-[59vh] bg-white rounded-4xl justify-center items-center h-full">
                <p className="text-gray-500 text-lg font-medium animate-pulse">Loading...</p>
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

    // --- Billing Calculations ---
    const totalCompleted = timeline.phases.reduce((sum, p) => sum + (p.completedAmount || 0), 0);
    const totalRemaining = timeline.phases.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);
    const totalAmount = totalCompleted + totalRemaining;

    const completedPercent = totalAmount ? Math.round((totalCompleted / totalAmount) * 100) : 0;
    const remainingPercent = totalAmount ? 100 - completedPercent : 0;

    // --- Chart ---
    const chartData = {
        datasets: [
            {
                data: [totalCompleted, totalRemaining],
                backgroundColor: ["#F4B472", "#E5E7EB"],
                borderWidth: 0,
                cutout: "70%",
                circumference: 360,
                rotation: -90,
            },
        ],
    };

    const chartOptions = { plugins: { legend: { display: false }, tooltip: { enabled: false } } };

    // --- Download Invoice ---
    const handleDownload = () => {
        const invoiceHTML = `
<html>
<head>
<title>Payment Summary</title>
<style>
body { font-family: Arial, sans-serif; padding: 20px; }
h1, h2 { text-align: center; color: #333; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
tr:nth-child(even) { background-color: #f9f9f9; }
.status { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; color: white; }
.completed { background-color: #2EB832; }
.pending { background-color: #F23636; }
</style>
</head>
<body>
<h1>Payment Summary</h1>
<h2>Total Payment: ₹${(totalCompleted + totalRemaining).toLocaleString("en-IN")}</h2>
<table>
<thead>
<tr><th>Milestone</th><th>Amount</th><th>Due Date</th><th>Status</th></tr>
</thead>
<tbody>
${timeline.phases.map(p => {
    const isCompleted = p.remainingAmount === 0 && p.completedAmount === p.actualBillingAmount;
    return `<tr>
        <td>${p.title}</td>
        <td>₹${p.actualBillingAmount?.toLocaleString("en-IN")}</td>
        <td>${p.date?.split("→").pop().trim()}</td>
        <td><span class="status ${isCompleted ? 'completed' : 'pending'}">${isCompleted ? 'Completed' : 'Pending'}</span></td>
    </tr>`;
}).join("")}
</tbody>
</table>
<div class="summary">
<p><strong>Completed:</strong> ${completedPercent}%</p>
<p><strong>Pending:</strong> ${remainingPercent}%</p>
</div>
</body>
</html>`;

        const blob = new Blob([invoiceHTML], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Invoice_${new Date().toISOString().split("T")[0]}.html`;
        link.click();
    };

    // --- Render ---
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl h-[96vh] shadow-sm border border-gray-100 p-8 max-w-6xl mx-auto flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

            {/* Top Overview */}
            <div className="flex bg-white p-3 px-6 rounded-2xl border-l-5 border-[#F4B472] justify-between items-center flex-wrap gap-6">
                <div>
                    <p className="text-sm text-black font-semibold my-3">Total payment</p>
                    <h1 className="text-3xl font-bold text-gray-900">
                        ₹{(totalCompleted + totalRemaining).toLocaleString("en-IN")}
                    </h1>
                </div>
                <div className="relative flex justify-center items-center">
                    <div className="w-28 h-28">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center text-[#F4B472] font-bold text-base">
                        {completedPercent}%
                    </div>
                </div>
                <div className="text-right flex flex-col justify-center items-center">
                    <p className="text-lg font-bold text-gray-900">Reports</p>
                    <div className="flex gap-5">
                        <div className="text-center">
                            <p className="text-sm text-gray-700">Completed</p>
                            <p className="text-sm text-black font-semibold">{completedPercent}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-700">Pending</p>
                            <p className="text-sm text-black font-semibold">{remainingPercent}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Milestone Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-900">Payment Status</h3>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 cursor-pointer text-sm px-3 py-1.5 rounded-md bg-white/90 hover:bg-gray-50"
                    >
                        <FaDownload className="text-gray-600" />
                        Download Summary
                    </button>
                </div>

                <div className="grid grid-cols-4 px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50">
                    <div>Milestone</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Due Date</div>
                    <div className="text-right">Status</div>
                </div>

                <div className="divide-y overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {timeline.phases.map((phase, i) => {
                        const images = [img1, img2, img3, img4];
                        const phaseImage = images[i % images.length];

                        const isCompleted = phase.remainingAmount === 0 && phase.completedAmount === phase.actualBillingAmount;

                        return (
                            <div key={i} className="grid grid-cols-4 items-center px-6 py-4 text-sm text-gray-700 hover:bg-gray-50 transition">
                                <div className="flex items-center gap-2 truncate">
                                    <img src={phaseImage} alt={phase.title} className="w-10 h-10 object-contain" />
                                    {phase.title}
                                </div>
                                <div className={`text-right font-semibold ${isCompleted ? "text-[#2EB832]" : "text-[#F23636]"}`}>
                                    ₹{(isCompleted ? phase.completedAmount : phase.remainingAmount)?.toLocaleString("en-IN")}
                                </div>
                                <div className="text-right">{phase.date?.split("→").pop().trim()}</div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isCompleted ? "bg-[#2EB832]/20 text-[#2EB832]" : "bg-[#F23636]/20 text-[#F23636]"}`}>
                                        {isCompleted ? "Completed" : "Due"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
