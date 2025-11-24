// VendorProjectDropdown.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorDashboard } from "../redux/vendorDashboardSlice"; // ✅ import thunk
import purchase from "./purchase.png";
import approved from "./approved.png";
import cancelled from "./cancelled.png";
import pending from "./pending.png";

const VendorProjectDropdown = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.vendorDashboard);

 useEffect(() => {
  // ✅ Only fetch if data is not already available
  if (
    !data ||
    (data.total_orders === 0 &&
      data.open_orders === 0 &&
      data.released_orders === 0 &&
      data.pending_approval_orders === 0)
  ) {
    dispatch(fetchVendorDashboard("garvit.dang@onmeridian.com"));
  }
}, [dispatch, data]);
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