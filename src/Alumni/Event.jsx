import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaCalendarAlt, FaUserFriends, FaBell, FaRegCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import bgImageds from "./bgImageds.jpg";

const API = `${import.meta.env.VITE_BACKEND_URL}/primus/events`;

const formatDate = (isoOrText) => {
  if (!isoOrText) return "No date";
  const d = new Date(isoOrText);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return String(isoOrText);
};

export default function Event({ limit, minimal }) {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminders, setReminders] = useState([]);

  // ✅ Ask notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ✅ Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Missing authentication token. Please log in.");

        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = (res.data.items || []).map((item) => ({
          id: item.id || Math.random().toString(36).slice(2, 9),
          title: item.title || "Untitled Event",
          desc: item.excerpt || item.summary || "",
          dateISO: item.published_at || item.date_text || null,
          guests: item.sector ? `${item.sector} Sector` : "General",
          image:
            item.img ||
            item.image ||
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
          link: item.link,
        }));

        setEvents(items);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 🔍 Filter events by search
  const filtered = useMemo(() => {
    if (!searchTerm) return events;
    const q = searchTerm.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q)
    );
  }, [searchTerm, events]);

  const displayedEvents = useMemo(
    () => (limit ? filtered.slice(0, limit) : filtered),
    [filtered, limit]
  );

  // 🕓 Reminder setup
  const handleSetReminder = (event) => {
    if (!event.dateISO) return alert("This event doesn't have a valid date.");

    const eventTime = new Date(event.dateISO).getTime();
    const now = Date.now();
    const diff = eventTime - now - 60 * 60 * 1000; // 1 hour before

    if (diff > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`⏰ Reminder: ${event.title}`, {
            body: `Your event starts soon at ${formatDate(event.dateISO)}.`,
            icon: event.image,
          });
        }
      }, diff);
      setReminders((prev) => [...prev, event.id]);
      alert(`Reminder set for "${event.title}" 1 hour before the event.`);
    } else {
      alert("This event time has already passed or is too close to set a reminder.");
    }
  };

  // 🗓 Filter by selected calendar date
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(
      (e) =>
        new Date(e.dateISO).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate, events]);

  return (
    <div
      className={`${minimal
        ? ""
        : "-mt-[5rem] bg-cover bg-center bg-no-repeat min-h-screen bg-gradient-to-br from-[#f6f6f3] to-[#fffdf8] p-4 sm:p-8 text-sm text-gray-700"
        }`}
      style={!minimal ? { backgroundImage: `url(${bgImageds})` } : {}}
    >
      {!minimal && (
        <div className="mt-[5rem] flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Events</h1>

          <div className="flex items-center gap-3 mt-3 sm:mt-0 relative">
            {/* 🔍 Search */}
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

            {/* 🗓 Dropdown Calendar Toggle (icon only) */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar((prev) => !prev)}
                className="cursor-pointer flex items-center justify-center text-sm font-medium text-[#102437] border border-[#102437] rounded-full px-3 py-2 hover:bg-[#102437] hover:text-white transition"
                title={showCalendar ? "Hide Calendar" : "Show Calendar"}
              >
                {showCalendar ? (
                  <FaRegCalendarCheck size={16} />
                ) : (
                  <FaCalendarAlt size={16} />
                )}
              </button>

              {showCalendar && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4 z-10">
                  <Calendar
                    onClickDay={(date) => setSelectedDate(date)}
                    tileClassName={({ date }) => {
                      const hasEvent = events.some(
                        (e) =>
                          new Date(e.dateISO).toDateString() ===
                          date.toDateString()
                      );
                      return hasEvent ? "highlight-date" : null;
                    }}
                    tileContent={({ date }) => {
                      const eventToday = events.find(
                        (e) =>
                          new Date(e.dateISO).toDateString() ===
                          date.toDateString()
                      );
                      return eventToday ? (
                        <div className="text-[10px] text-[#B8854C] mt-1 font-medium">
                          •
                        </div>
                      ) : null;
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loader / Error / Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading events...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : (
        <>
          {selectedDate && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Events on {selectedDate.toDateString()}:
                </h3>
                {/* 🟢 Show All Events button */}
                <button
                  onClick={() => setSelectedDate(null)}
                  className="cursor-pointer text-sm text-[#102437] font-medium hover:underline"
                >
                  Show All Events
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map((event) => (
                    <article
                      key={event.id}
                      className="bg-[#fdfbf7] rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row gap-4"
                    >
                      <div className="flex-shrink-0 w-full md:w-2/5 h-44 md:h-48 rounded-lg overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-semibold text-gray-800 text-lg leading-snug mb-1">
                            {event.title}
                          </h2>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {event.desc}
                          </p>
                          {event.link && (
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#B8854C] font-medium hover:underline"
                            >
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
                          <button
                            onClick={() => handleSetReminder(event)}
                            disabled={reminders.includes(event.id)}
                            className={`flex items-center gap-1 text-xs font-medium ${reminders.includes(event.id)
                              ? "text-green-600"
                              : "text-[#B8854C] hover:underline"
                              }`}
                          >
                            <FaBell size={12} />
                            {reminders.includes(event.id)
                              ? "Reminder Set"
                              : "Set Reminder"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-gray-500">No events on this date.</p>
                )}
              </div>
            </div>
          )}

          {/* Normal event list when no date selected */}
          {!selectedDate && (
            <div
              className={`grid ${minimal ? "grid-cols-1" : "md:grid-cols-2"
                } gap-6 justify-center`}
            >
              {displayedEvents.map((event) => (
                <article
                  key={event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-row w-full max-w-2xl mx-auto"
                >
                  {/* ✅ Image Section */}
                  <div
                    className={`flex-shrink-0 overflow-hidden ${minimal
                        ? "w-2/5 h-48"
                        : "w-[40%] h-52"
                      }`}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* ✅ Content Section */}
                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div
                      className={`flex-1 flex flex-col justify-between ${minimal ? "mt-3" : ""
                        }`}
                    >
                      <div>
                        <h2 className="font-semibold text-gray-800 text-lg leading-snug mb-2 line-clamp-3">
                          {event.title}
                        </h2>
                        <p
                          className={`text-sm text-gray-600 mb-3 ${minimal ? "line-clamp-2" : "line-clamp-3"
                            }`}
                        >
                          {event.desc}
                        </p>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#B8854C] font-medium hover:underline"
                          >
                            Read more
                          </a>
                        )}
                      </div>

                      <div
                        className={`flex ${minimal ? "flex-row justify-between items-center text-xs" : "justify-between items-center text-xs"
                          } text-gray-500 mt-3`}
                      >
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

                  </div>
                </article>


              ))}
            </div>
          )}

        </>
      )}
    </div>
  );
}