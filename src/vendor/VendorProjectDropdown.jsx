import React, { useState, useEffect } from "react";
import axios from "axios";
import purchase from "./purchase.png";
import approved from "./approved.png";
import cancelled from "./cancelled.png";
import pending from "./pending.png";

// Get base URL from env
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const VendorProjectDropdown = () => {
  const [data, setData] = useState({
    total_orders: 0,
    open_orders: 0,
    released_orders: 0,
    pending_approval_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("authToken");

      console.log("🔍 BASE_URL =", BASE_URL);
      console.log("🔑 Token =", token);
      console.log("📡 Making API call to:", `${BASE_URL}/vendor/purchase-orders-dashboard`);

      try {
        setLoading(true);

        const response = await axios.post(
          `${BASE_URL}/vendor/purchase-orders-dashboard`,
          { vendor_email: "garvit.dang@onmeridian.com" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Raw API Response:", response);
        console.log("✅ Response Data:", response.data);

        const resData = response.data;
        setData({
          total_orders: resData.total_orders,
          open_orders: resData.open_orders,
          released_orders: resData.released_orders,
          pending_approval_orders: resData.pending_approval_orders,
        });
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);

        if (error.response) {
          // Server responded with a non-2xx status code
          console.error("📨 Error Response Data:", error.response.data);
          console.error("📨 Error Response Status:", error.response.status);
          console.error("📨 Error Response Headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error("📡 No response received:", error.request);
        } else {
          // Something else happened
          console.error("⚙️ Request setup error:", error.message);
        }
      } finally {
        setLoading(false);
        console.log("✅ Fetch attempt completed (loading set to false).");
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    { title: "Total Purchase Orders", value: data.total_orders, img: purchase, bg: "bg-purple-100" },
    { title: "Open Purchase Orders", value: data.open_orders, img: approved, bg: "bg-green-100" },
    { title: "Released Purchase Orders", value: data.released_orders, img: pending, bg: "bg-yellow-100" },
    { title: "Pending Purchase Orders", value: data.pending_approval_orders, img: cancelled, bg: "bg-red-100" },
  ];

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="md:w-1/4 w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow"
          >
            {/* Left side: icon/image */}
            <div className={`p-3 rounded-full ${card.bg} flex items-center justify-center`}>
              {loading ? (
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
              ) : (
                <img src={card.img} alt={card.title} className="w-12 h-12 object-contain" />
              )}
            </div>

            {/* Right side: title & number */}
            <div className="text-left flex flex-col gap-1">
              {loading ? (
                <>
                  <div className="w-16 h-6 bg-gray-300 rounded" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </>
              ) : (
                <>
                  <div className="mt-1 text-black font-bold text-[1.5rem]">{card.value}</div>
                  <div className="text-[#202224] font-medium text-[14px] leading-tight">
                    {card.title}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorProjectDropdown;
