import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bgImageds from "./bgImageds.jpg";

const API = `${import.meta.env.VITE_BACKEND_URL}/primus/events`;

// format ISO date (or fallback text)
const formatDate = (isoOrText) => {
  if (!isoOrText) return "No date";
  // if ISO-like string -> try to parse
  const d = new Date(isoOrText);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  // fallback to raw text
  return String(isoOrText);
};

export default function Event({ limit, minimal }) {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Missing authentication token. Please log in.");
        }

        const res = await axios.get(API, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = res.data || {};

        // map backend fields to frontend-friendly shape
        const items = (data.items || []).map((item) => {
          // backend returns image in `img` (normalized by services.py)
          const img = item.img || item.image || item.image_url || null;
          const excerpt = item.excerpt ?? item.summary ?? "";
          const published_at = item.published_at ?? item.date_text ?? null;

          return {
            id: item.id || item.link || Math.random().toString(36).slice(2, 9),
            title: item.title || "Untitled Event",
            desc: excerpt,
            dateISO: published_at, // may be ISO or text
            dateText: published_at,
            guests: item.sector ? `${item.sector} Sector` : "General",
            image: img || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
            link: item.link,
          };
        });

        setEvents(items);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to load events. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // simple client-side search
  const filtered = useMemo(() => {
    if (!searchTerm) return events;
    const q = searchTerm.toLowerCase();
    return events.filter((e) => (e.title || "").toLowerCase().includes(q) || (e.desc || "").toLowerCase().includes(q));
  }, [searchTerm, events]);

  const displayedEvents = useMemo(() => (limit ? filtered.slice(0, limit) : filtered), [filtered, limit]);

  const recentEvents = [
    { name: "Sing Forever", org: "entertainment.vibrantcompany.net" },
    { name: "Entertainment Hyperio", org: "worldofmusic.com/event" },
    { name: "Excaliber The Best Choice", org: "excaliberevents.net/show" },
    { name: "Forever in Michigan", org: "michiganconnects.org" },
  ];

  const recentVideos = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
  ];

  return (
    <div
      className={`${
        minimal
          ? ""
          : "-mt-[5rem] bg-cover bg-center bg-no-repeat min-h-screen bg-gradient-to-br from-[#f6f6f3] to-[#fffdf8] p-4 sm:p-8 text-sm text-gray-700"
      }`}
      style={!minimal ? { backgroundImage: `url(${bgImageds})` } : {}}
    >
      {!minimal && (
        <div className="mt-[5rem] flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Events</h1>

          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className="bg-white flex items-center border border-gray-300 rounded-full px-3 py-2 w-72">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading / Error states */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading events...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No events found.</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 space-y-5">
            {minimal && limit === 1 && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Event</h2>
                <button
                    onClick={() => navigate("/event")}
                    className="cursor-pointer relative z-10 ml-[45rem] text-sm text-[#B8854C] font-medium hover:underline"
                >
                  View All
                </button>
              </div>
            )}

            {displayedEvents.map((event) => (
              <article
                key={event.id}
                className="w-[54rem] mb-[2rem] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row gap-4"
              >
                <div className="flex-shrink-0 w-full md:w-2/5 h-44 md:h-48 rounded-lg overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-lg leading-snug mb-1">{event.title}</h2>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{event.desc}</p>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#B8854C] font-medium hover:underline">
                        Read more
                      </a>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#B8854C]" />
                      {formatDate(event.dateISO)}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUserFriends className="text-[#B8854C]" />
                      {event.guests}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!minimal && (
            <aside className="w-full lg:w-1/3 space-y-5">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Recent Events</h3>
                <div className="space-y-3">
                  {recentEvents.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-[#f9f9f9] hover:bg-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.org}</p>
                      </div>
                      <span className="text-[#B8854C] text-xs font-medium cursor-pointer">View</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Recent Events Videos</h3>
                <div className="space-y-3">
                  {recentVideos.map((vid, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden">
                      <img src={vid} alt="Event video" className="w-full h-36 object-cover hover:scale-[1.02] transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
