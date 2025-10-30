import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Clock, Trash2, Users, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UpcomingMeetings = ({ selectedDate = "2024-12-16", onMeetingUpdate = () => { } }) => {
  const user = useSelector(state => state.user);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("Timeline");
  const [filterScope, setFilterScope] = useState("day");
  const [cancellingId, setCancellingId] = useState(null);

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  const cleanDate = (dateStr) => {
    if (!dateStr) return null;
    const cleaned = dateStr.replace(/\.0000000/, "");
    const d = new Date(cleaned);
    return isNaN(d) ? null : d;
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // console.log("Fetching meetings for:", user.email, "with scope:", filterScope);
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/dynamics/meetings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.authToken}`
          },
          body: JSON.stringify({
            user_email: user.email,
            scope: filterScope
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Failed to fetch meetings");

        const now = new Date();

        const normalizedMeetings = data.meetings.map(m => {
          const startDate = cleanDate(m.start);
          const endDate = cleanDate(m.end);

          const status = endDate && endDate < now ? "Completed" : "Upcoming";

          return {
            id: m.id,
            title: m.subject || "Untitled",
            startDate,
            endDate,
            startTime: startDate ? startDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-",
            endTime: endDate ? endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-",
            startDateDisplay: startDate
              ? startDate.toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "-",
            endDateDisplay: endDate
              ? endDate.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })
              : "-",
            duration: m.duration_minutes || 0,
            color: status === "Completed" ? "bg-green-500" : "bg-blue-500",
            attendees: Array.isArray(m.attendees) ? m.attendees : [],
            location: m.location || "N/A",
            joinUrl: m.joinUrl || "#",
            status
          };
        });

        setMeetings(normalizedMeetings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [selectedDate, user, filterScope]);

  const handleCancelMeeting = async (meetingId) => {
    setCancellingId(meetingId);

    try {
      const response = await fetch(`${BACKEND_URL}/dynamics/cancel-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.authToken}`
        },
        body: JSON.stringify({
          organizer_email: user.email,
          meeting_id: meetingId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error?.message || "You are not the organizer");
        return;
      }

      setMeetings(prev => prev.filter(m => m.id !== meetingId));
      toast.success("Meeting cancelled successfully");
      onMeetingUpdate("cancelled", meetingId);

    } catch {
      toast.error("Something went wrong while cancelling");
    } finally {
      setCancellingId(null);
    }
  };

  const calculateMeetingStyle = (meeting) => {
    if (!meeting.startDate || !meeting.endDate) return { left: "0%", width: "10%" };

    const dayStartMinutes = 8 * 60;
    const dayEndMinutes = 18 * 60;
    const totalDayMinutes = dayEndMinutes - dayStartMinutes;

    const startMinutes = meeting.startDate.getHours() * 60 + meeting.startDate.getMinutes();
    const endMinutes = meeting.endDate.getHours() * 60 + meeting.endDate.getMinutes();

    const left = ((startMinutes - dayStartMinutes) / totalDayMinutes) * 100;
    const width = ((endMinutes - startMinutes) / totalDayMinutes) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.max(width, 5)}%`
    };
  };

  if (loading) return <div className="text-center p-10">Loading meetings...</div>;
  if (error) return <div className="text-red-600 p-10">Error loading meetings: {error}</div>;

  return (
    <div className="bg-white rounded-2xl p-6 max-w-6xl mx-auto h-[425px] overflow-x-auto [scrollbar-width:0] [&::-webkit-scrollbar]:hidden">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h2>

        <div className="flex items-center space-x-3">
          {/* Day/Week filter */}
          <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setFilterScope("day")}
              className={`px-4 py-2 text-sm ${filterScope === "day" ? "bg-[#102437] text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Day
            </button>
            <button
              onClick={() => setFilterScope("week")}
              className={`px-4 py-2 text-sm ${filterScope === "week" ? "bg-[#102437] text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Week
            </button>
          </div>

          {/* Timeline/Calendar switch */}
          <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setCurrentView("Timeline")}
              className={`px-4 py-2 text-sm ${currentView === "Timeline" ? "bg-[#102437] text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setCurrentView("Calendar")}
              className={`px-4 py-2 text-sm ${currentView === "Calendar" ? "bg-[#102437] text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Timeline view */}
      {currentView === "Timeline" && (
        <div className="space-y-6">
          {/* Hours row */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-gray-700 font-medium">
            {timeSlots.map((time, i) => (
              <div key={i} className="flex-1 text-center text-xs sm:text-sm">{time}</div>
            ))}
          </div>

          {/* Background grid */}
          <div className="relative mt-3">
            <div className="absolute inset-0 flex">
              {timeSlots.map((_, i) => (
                <div key={i} className="flex-1 border-r border-gray-200 last:border-r-0" />
              ))}
            </div>

            <div className="relative z-20" style={{ minHeight: `${meetings.length * 200}px` }}>
              {meetings.map((meeting, i) => {
                const style = calculateMeetingStyle(meeting);
                const isCurrentCancelling = cancellingId === meeting.id;

                return (
                  <div
                    key={meeting.id}
                    className={`relative group absolute rounded-xl px-3 py-2 shadow-md 
              text-white text-sm font-medium truncate cursor-pointer 
              transition-all duration-200 ${meeting.color}`}
                    style={{
                      top: `${i * 70}px`,
                      left: style.left,
                      width: style.width,
                      minWidth: "200px",
                      height: "64px"
                    }}
                  >
                    <div className="truncate">{meeting.title}</div>
                    <div className="text-xs font-normal opacity-90">
                      {meeting.startTime} - {meeting.endTime} <br /> ({meeting.status})
                    </div>

                    {meeting.status === "Upcoming" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelMeeting(meeting.id);
                        }}
                        className={`absolute top-2 right-2 p-1 rounded 
                 ${isCurrentCancelling ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                        disabled={isCurrentCancelling}
                      >
                        {isCurrentCancelling ? (
                          <span className="loader border-white border-2 rounded-full w-4 h-4 animate-spin inline-block"></span>
                        ) : (
                          <Trash2 size={14} className="text-white" />
                        )}
                      </button>
                    )}
                  </div>

                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Calendar view */}
      {currentView === "Calendar" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map(meeting => {
            const isCurrentCancelling = cancellingId === meeting.id;
            const isDisabled = cancellingId !== null && !isCurrentCancelling;

            return (
              <div key={meeting.id} className={`${meeting.color} rounded-xl p-4 text-white shadow-md`}>
                <div className="font-semibold mb-2">{meeting.title}</div>
                <div className="text-sm opacity-90 space-y-1">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{meeting.startDateDisplay} - {meeting.endDateDisplay}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} /><span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} /><span>{meeting.attendees.length} attendees</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Status: {meeting.status}</span>
                  </div>
                </div>

                {/* ✅ Cancel button restored */}
                {meeting.status === "Upcoming" && (
                  <button
                    onClick={() => handleCancelMeeting(meeting.id)}
                    disabled={isDisabled}
                    className={`mt-3 px-3 py-1 rounded text-xs transition-colors duration-200 
                ${isCurrentCancelling
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"}`}
                  >
                    {isCurrentCancelling ? (
                      <span className="loader border-white border-2 rounded-full w-4 h-4 animate-spin inline-block"></span>
                    ) : (
                      "Cancel"
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;