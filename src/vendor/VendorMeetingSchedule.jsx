import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Trash2, Edit3, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import bgImageds from "./bgImageds.jpg";
import calendarImg from "./image.png";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

// Utils
const formatDateLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const parseServerDate = (dateStr) => {
  if (!dateStr) return null;
  const cleaned = dateStr.replace?.(/\.0000000$/, "") || dateStr;
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
};
const toHM = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
const computeRangeForScope = (date, scope) => {
  const base = new Date(date);
  if (scope === "day") {
    const start = new Date(base);
    start.setHours(0, 0, 0, 0);
    const end = new Date(base);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  if (scope === "week") {
    const day = base.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(base);
    start.setDate(base.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  // month
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};
const emailRegex =
  // Simple RFC 5322-ish email check for UI use
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const normalizeMeeting = (m) => {
  const startDate = parseServerDate(m.start || m.start_time);
  const endDate =
    parseServerDate(m.end || m.end_time) ||
    (startDate ? new Date(startDate.getTime() + 60 * 60 * 1000) : null);

  return {
    id:
      m.id ||
      m.meetingId ||
      m.event_id ||
      `${(startDate || new Date()).getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    title: m.subject || m.title || "Untitled",
    date: startDate ? formatDateLocal(startDate) : "",
    start_time: startDate ? startDate.toISOString() : "",
    end_time: endDate ? endDate.toISOString() : "",
    attendees: Array.isArray(m.attendees)
      ? m.attendees
      : Array.isArray(m.client_emails)
      ? m.client_emails
      : [],
    location: m.location || "",
    amount: m.amount || "",
    description: m.description || "",
    inviteEmail: Array.isArray(m.client_emails) ? m.client_emails : [],
  };
};

// API
const meetingAPI = {
  getMeetings: async ({ scope, userEmail, windowStart, windowEnd }) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await fetch(`${BACKEND_URL}/dynamics/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          user_email: userEmail,
          scope, // "day" | "week" | "month"
          // Optionally provide explicit window for the backend if supported:
          start: windowStart?.toISOString(),
          end: windowEnd?.toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch meetings");

      const raw = Array.isArray(data) ? data : data.meetings || [];
      return raw.map(normalizeMeeting);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      toast.error("Unable to fetch meetings");
      return [];
    }
  },

  createMeeting: async (meetingData) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${BACKEND_URL}/dynamics/schedule-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(meetingData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create meeting");

      // Normalize response so the UI shape is consistent
      const normalized = normalizeMeeting({
        ...data,
        subject: data.subject ?? meetingData.subject,
        start: data.start ?? data.start_time ?? meetingData.start_time,
        end: data.end ?? data.end_time ?? meetingData.end_time,
        client_emails: data.client_emails ?? meetingData.client_emails,
        description: data.description ?? meetingData.description,
      });

      return normalized;
    } catch (err) {
      console.error("Error creating meeting:", err);
      toast.error("Failed to create meeting");
      return null;
    }
  },

  updateMeeting: async (meetingId, updates) => {
    // TODO: Replace with real API when available.
    // For now: simulate latency and success.
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 350));
  },

  deleteMeeting: async (meetingId, organizerEmail) => {
  try {
    const authToken = localStorage.getItem("authToken"); // <-- add this line
    const res = await fetch(`${BACKEND_URL}/dynamics/cancel-meeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        organizer_email: organizerEmail,
        meeting_id: meetingId,
        message: "This meeting has been cancelled by the organizer.",
      }),
    });


    if (!res.ok) {
      const errText = await res.text();
      console.error("Error cancelling meeting:", errText);
      throw new Error(`Failed to cancel meeting: ${errText}`);
    }

    const data = await res.json();
    console.log("Meeting cancelled:", data);
    return data;
  } catch (err) {
    console.error("Error deleting meeting:", err);
    return null;
  }
},

};

const VendorMeetingScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [modalType, setModalType] = useState("create"); // "create" | "view" | "edit"
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const organizerEmailFromLS = localStorage.getItem("Email") || "";
  const [organizerEmail] = useState(organizerEmailFromLS);

  const [formData, setFormData] = useState({
    title: "",
    start_time: "10:00",
    end_time: "11:00",
    description: "",
    inviteEmail: [],
  });

  const [viewMode, setViewMode] = useState("Weekly");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday-first
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        date: new Date(year, month, day),
      });
    }

    // Next month's leading days to fill 6 weeks grid
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const getMeetingsForDate = useCallback(
    (date) => {
      const dateStr = formatDateLocal(date);
      return meetings
        .filter((m) => m.date === dateStr)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    },
    [meetings]
  );

useEffect(() => {
  const fetchMeetings = async () => {
    if (!organizerEmail) {
      setMeetings([]);
      return;
    }
    setIsFetching(true); // start loading
    try {
      const scopeMap = { Daily: "day", Weekly: "week", Monthly: "month" };
      const scope = scopeMap[viewMode] || "week";
      const { start, end } = computeRangeForScope(currentDate, scope);

      const meetingsData = await meetingAPI.getMeetings({
        scope,
        userEmail: organizerEmail,
        windowStart: start,
        windowEnd: end,
      });
      setMeetings(meetingsData);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setIsFetching(false); // stop loading
    }
  };
  fetchMeetings();
}, [currentDate, viewMode, organizerEmail]);


  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Form helpers
  const resetForm = () => {
    setFormData({
      title: "",
      start_time: "10:00",
      end_time: "11:00",
      description: "",
      inviteEmail: [],
    });
    setSelectedMeeting(null);
  };

  const openCreateForDate = (date) => {
    setSelectedDate(date);
    setModalType("create");
    resetForm();
    setShowModal(true);
  };

  const openViewForMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setSelectedDate(meeting.start_time ? new Date(meeting.start_time) : new Date());
    setModalType("view");
    setFormData({
      title: meeting.title || "",
      start_time: toHM(meeting.start_time) || "10:00",
      end_time: toHM(meeting.end_time) || "11:00",
      description: meeting.description || "",
      inviteEmail: Array.isArray(meeting.inviteEmail) ? meeting.inviteEmail : [],
    });
    setShowModal(true);
  };

  const handleCalendarCellClick = (dayDate, dayData) => {
    if (!dayData.isCurrentMonth) return;
    openCreateForDate(dayDate);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    if (!selectedDate || !formData.start_time || !formData.end_time) {
      toast.error("Please select date and time");
      return;
    }

    const startDateTime = new Date(`${formatDateLocal(selectedDate)}T${formData.start_time}:00`);
    const endDateTime = new Date(`${formatDateLocal(selectedDate)}T${formData.end_time}:00`);
    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    // Validate emails
    const invalid = (formData.inviteEmail || []).filter((e) => !emailRegex.test(e));
    if (invalid.length > 0) {
      toast.error(`Invalid email(s): ${invalid.join(", ")}`);
      return;
    }

    const meetingPayload = {
      organizer_email: organizerEmail,
      client_emails: formData.inviteEmail,
      subject: formData.title.trim(),
      description: formData.description?.trim() || "",
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
    };

    try {
      setIsSaving(true);

      if (modalType === "create") {
        const created = await meetingAPI.createMeeting(meetingPayload);
        if (created) {
          setMeetings((prev) => [...prev, created]);
          toast.success("Meeting created");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setShowModal(false);
          }, 2500);
          resetForm();
        }
      } else if (modalType === "edit" && selectedMeeting) {
        const result = await meetingAPI.updateMeeting(selectedMeeting.id, meetingPayload);
        if (result?.success) {
          setMeetings((prev) =>
            prev.map((m) =>
              m.id === selectedMeeting.id
                ? {
                    ...m,
                    title: meetingPayload.subject,
                    description: meetingPayload.description,
                    start_time: meetingPayload.start_time,
                    end_time: meetingPayload.end_time,
                    inviteEmail: meetingPayload.client_emails,
                    date: formatDateLocal(new Date(meetingPayload.start_time)),
                  }
                : m
            )
          );
          toast.success("Meeting updated");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setShowModal(false);
          }, 1500);
          resetForm();
        } else {
          toast.error("Failed to update meeting");
        }
      }
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast.error("Failed to save meeting");
    } finally {
      setIsSaving(false);
    }
  };

    const teamMembersList = [
    { name: "Shivam Gupta", email: "shivam.gupta@onmeridian.com" },
  ];

  const handleDelete = async () => {
  if (!selectedMeeting) return;

  if (window.confirm("Are you sure you want to cancel this meeting?")) {
    try {
      setIsSaving(true);

      const result = await meetingAPI.deleteMeeting(
  selectedMeeting.id,
  organizerEmail // ✅ corrected variable
);


      if (result && result.status === "cancelled") {
        toast.success("Meeting cancelled successfully!");
        setMeetings((prev) => prev.filter((m) => m.id !== selectedMeeting.id));
        setShowModal(false);
        resetForm();
      } else {
        toast.error("Failed to cancel meeting on server.");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Error cancelling meeting.");
    } finally {
      setIsSaving(false);
    }
  }
};


  return (
    <div className="bg-gray-100 rounded-3xl p-6 relative">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between space-x-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-yellow-100 rounded-lg">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-yellow-100 rounded-lg">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex bg-gray-200 rounded-full p-1">
            {["Daily", "Weekly", "Monthly"].map((view) => (
              <button
                key={view}
                onClick={() => setViewMode(view)}
                className={`px-4 py-1.5 text-sm cursor-pointer font-medium rounded-full transition-all duration-300 ${
                  viewMode === view ? "bg-gray-900 text-white shadow-sm" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setModalType("create");
            setSelectedDate(new Date());
            resetForm();
            setShowModal(true);
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-3xl text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          + New Schedule
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 relative">
{isFetching && (
  <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl z-10">
    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
  </div>
)}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((dayData, index) => {
            const dayMeetings = getMeetingsForDate(dayData.date);
            const isToday = formatDateLocal(dayData.date) === formatDateLocal(new Date());

            return (
              <div
                key={index}
                onClick={() => handleCalendarCellClick(dayData.date, dayData)}
                className={`min-h-20 p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !dayData.isCurrentMonth ? "text-gray-400 bg-gray-50" : "bg-white"
                } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""}`}>{dayData.day}</div>

                {dayMeetings.length > 0 && (
                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map((meeting) => (
                      <button
                        key={meeting.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewForMeeting(meeting);
                        }}
                        className="w-full text-left bg-orange-200 hover:bg-orange-300 transition-colors text-orange-900 px-2 py-1 rounded text-xs truncate"
                        title={`${meeting.title} (${toHM(meeting.start_time)} - ${toHM(meeting.end_time)})`}
                      >
                        <div className="font-medium truncate">{meeting.title}</div>
                        <div className="text-[10px] opacity-80">
                          {toHM(meeting.start_time)} - {toHM(meeting.end_time)}
                        </div>
                      </button>
                    ))}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayMeetings.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <img src={calendarImg} alt="Calendar" className="w-40 h-40 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Success</h3>
                <p className="text-[#898989] text-sm mb-6">
                  Your meeting details have been sent. Participants will receive an invite.
                </p>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setShowModal(false);
                  }}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <style>{`.modal-scroll::-webkit-scrollbar{display:none}`}</style>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {modalType === "create"
                      ? "Schedule New Meeting"
                      : modalType === "edit"
                      ? "Edit Meeting"
                      : "Meeting Details"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 modal-scroll">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Date *</label>
                    <input
                      type="date"
                      name="meeting_date"
                      value={selectedDate ? formatDateLocal(selectedDate) : ""}
                      onChange={(e) => {
                        const [y, m, d] = e.target.value.split("-");
                        const next = new Date(y, Number(m) - 1, Number(d));
                        setSelectedDate(next);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={modalType === "view"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Enter meeting title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={modalType === "view"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={modalType === "view"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={modalType === "view"}
                      />
                    </div>
                  </div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Invitee Emails
  </label>
  <div className="flex flex-wrap gap-2 items-center w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">

    {/* Display selected invitees */}
    {formData.inviteEmail.map((email, idx) => (
      <div
        key={idx}
        className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
      >
        {email}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              inviteEmail: prev.inviteEmail.filter((_, i) => i !== idx),
            }))
          }
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    ))}

    {/* Team member dropdown (replaces input) */}
    <select
      className="flex-1 outline-none p-1 text-sm bg-transparent"
      disabled={modalType === "view"}
      onChange={(e) => {
        const selectedMember = teamMembersList.find(
          (m) => m.name === e.target.value
        );
        if (
          selectedMember &&
          !formData.inviteEmail.includes(selectedMember.email)
        ) {
          setFormData((prev) => ({
            ...prev,
            inviteEmail: [...prev.inviteEmail, selectedMember.email],
          }));
        }
        e.target.value = ""; // reset dropdown
      }}
    >
      <option value="">Select Team Member</option>
      {teamMembersList.map((member) => (
        <option key={member.email} value={member.name}>
          {member.name}
        </option>
      ))}
    </select>
  </div>
</div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Meeting description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      disabled={modalType === "view"}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  {modalType === "view" ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setModalType("edit")}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          resetForm();
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSaving || !formData.title.trim()}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save size={16} />
                        )}
                        <span>{modalType === "create" ? "Create Meeting" : "Save Changes"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const VendorMeetingSchedule = () => {
  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      <div className="mt-[5rem]">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Schedule a Meeting</h1>
        <VendorMeetingScheduler />
      </div>
    </div>
  );
};

export default VendorMeetingSchedule;

// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Trash2,
//   Edit3,
//   Save,
// } from "lucide-react";
// import bgImageds from "./bgImageds.jpg";
// import calendarImg from "./image.png";
// import toast, { Toaster } from "react-hot-toast";
// // import { fetchProjectDetails, selectSelectedProjectData, selectSelectedProjectId, selectStatusById, selectErrorById } from "../../redux/projectSlice";


// const authToken = localStorage.getItem("authToken");
// console.log(authToken);
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// const meetingAPI = {
//   getMeetings: async (year, month, scope, userEmail, authToken) => {
//     const cleanDate = (dateStr) => {
//       if (!dateStr) return null;
//       const cleaned = dateStr.replace(/\.0000000/, "");
//       const d = new Date(cleaned);
//       return isNaN(d) ? null : d;
//     };

//     try {
//       const res = await fetch(`${BACKEND_URL}/dynamics/meetings`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
//         },
//         body: JSON.stringify({
//           user_email: userEmail,
//           scope,
//         }),
//       });

//       const data = await res.json();

//       console.log("Fetched meetings data:", data);
//       if (!res.ok) throw new Error(data.detail || "Failed to fetch meetings");

//       const normalized = (data.meetings || []).map((m) => {
//   const startRaw = m.start ? m.start.replace(/\.0000000/, "") : null;
//   const endRaw = m.end ? m.end.replace(/\.0000000/, "") : null;

//   const startDate = startRaw ? new Date(startRaw + "Z") : null;
//   const endDate = endRaw ? new Date(endRaw + "Z") : null;

//   return {
//     id: m.id,
//     title: m.subject || "Untitled",
//     // FIX: get UTC date string
//     // date: startDate
//     //   ? `${startDate.getUTCFullYear()}-${String(startDate.getUTCMonth() + 1).padStart(2, "0")}-${String(startDate.getUTCDate()).padStart(2, "0")}`
//     //   : "",
//     date: startDate
//   ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`
//   : "",


//     start_time: startDate ? startDate.toISOString() : "",
//     end_time: endDate ? endDate.toISOString() : "",
//     attendees: Array.isArray(m.attendees) ? m.attendees : [],
//     location: m.location || "",
//     amount: m.amount || "",
//     description: m.description || "",
//     inviteEmail: [],
//   };
// });


//       return normalized;
//     } catch (err) {
//       console.error("Error fetching meetings:", err);
//       return [];
//     }
//   },

//   createMeeting: async (meetingData) => {
//     const authToken = localStorage.getItem("authToken");

//     try {
//       const res = await fetch(`${BACKEND_URL}/dynamics/schedule-meeting`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(meetingData),
//       });
//       if (!res.ok) throw new Error("Failed to create meeting");
//       return await res.json();
//     } catch (err) {
//       console.error("Error creating meeting:", err);
//       return null;
//     }
//   },

//   updateMeeting: async (meetingId, updates) => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve({ success: true }), 300);
//     });
//   },

//   deleteMeeting: async (meetingId, organizerEmail) => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/dynamics/cancel-meeting`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: JSON.stringify({
//         organizer_email: organizerEmail,
//         meeting_id: meetingId,
//         message: "This meeting has been cancelled by the organizer.",
//       }),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       console.error("Error cancelling meeting:", errText);
//       throw new Error(`Failed to cancel meeting: ${errText}`);
//     }

//     const data = await res.json();
//     console.log("Meeting cancelled:", data);
//     return data;
//   } catch (err) {
//     console.error("Error deleting meeting:", err);
//     return null;
//   }
// },

// };

// const MeetingScheduler = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [meetings, setMeetings] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const [modalType, setModalType] = useState("create");
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [industryFilter, setIndustryFilter] = useState("");

//   const organizer_email = useSelector((state) => state.user.email);
//   const user = useSelector((state) => state.user);

//   const [formData, setFormData] = useState({
//     title: "",
//     start_time: "10:00",
//     end_time: "11:00",
//     attendees: "",
//     location: "",
//     amount: "",
//     description: "",
//     inviteEmail: [],
//   });

//   const [viewMode, setViewMode] = useState("Weekly");

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];

//   const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//   // New function to format date — returns UTC date (YYYY-MM-DD) so it matches meeting.date which is UTC
//   const formatDateLocal = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       if (!organizer_email) {
//         setMeetings([]);
//         return;
//       }

//       setIsFetching(true);
//       try {
//         const scopeMap = { Daily: "day", Weekly: "week", Monthly: "month" };
//         const scope = scopeMap[viewMode] || "week";

//         const meetingsData = await meetingAPI.getMeetings(
//           currentDate.getFullYear(),
//           currentDate.getMonth(),
//           scope,
//           organizer_email,
//           user?.authToken
//         );

//         setMeetings(meetingsData);
//       } catch (error) {
//         console.error("Error fetching meetings:", error);
//       } finally {
//         setIsFetching(false);
//       }
//     };
//     fetchMeetings();
//   }, [currentDate, viewMode, organizer_email, user?.authToken]);

//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

//     const days = [];

//     const prevMonth = new Date(year, month - 1, 0);
//     const prevMonthDays = prevMonth.getDate();
//     for (let i = startingDayOfWeek - 1; i >= 0; i--) {
//       days.push({
//         day: prevMonthDays - i,
//         isCurrentMonth: false,
//         isPrevMonth: true,
//         date: new Date(year, month - 1, prevMonthDays - i),
//       });
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push({
//         day: day,
//         isCurrentMonth: true,
//         isPrevMonth: false,
//         date: new Date(year, month, day),
//       });
//     }

//     const remainingDays = 42 - days.length;
//     for (let day = 1; day <= remainingDays; day++) {
//       days.push({
//         day: day,
//         isCurrentMonth: false,
//         isPrevMonth: false,
//         date: new Date(year, month + 1, day),
//       });
//     }

//     return days;
//   };

//   const getMeetingsForDate = (date) => {
//     const dateStr = formatDateLocal(date);  // now uses UTC date
//     return meetings.filter((meeting) => meeting.date === dateStr);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateClick = (date, dayData) => {
//     if (!dayData.isCurrentMonth) return;

//     setSelectedDate(date);
//     const dayMeetings = getMeetingsForDate(date);

//     if (dayMeetings.length > 0) {
//       setSelectedMeeting(dayMeetings[0]);
//       setModalType("view");
//       setFormData({
//         title: dayMeetings[0].title,
//         // start_time and end_time are UTC ISO strings — split to extract HH:MM (UTC), which matches backend's time
//         start_time: dayMeetings[0].start_time ? dayMeetings[0].start_time.split("T")[1].slice(0, 5) : "10:00",
//         end_time: dayMeetings[0].end_time ? dayMeetings[0].end_time.split("T")[1].slice(0, 5) : "11:00",
//         attendees: (dayMeetings[0].attendees || []).join(", "),
//         location: dayMeetings[0].location || "",
//         amount: dayMeetings[0].amount || "",
//         description: dayMeetings[0].description || "",
//         inviteEmail: dayMeetings[0].inviteEmail || [],
//       });
//     } else {
//       setModalType("create");
//       setSelectedMeeting(null);
//       setFormData({
//         title: "",
//         start_time: "10:00",
//         end_time: "11:00",
//         attendees: "",
//         location: "",
//         amount: "",
//         description: "",
//         inviteEmail: [],
//       });
//     }
//     setShowModal(true);
//   };

//   const handleSubmit = async () => {
//     if (!formData.title || !selectedDate || !formData.start_time || !formData.end_time) return;

//     // Build UTC Date using Date.UTC so the backend receives the same clock time (in UTC) as shown in UI
//     const year = selectedDate.getUTCFullYear();
//     const month = selectedDate.getUTCMonth(); // zero-based
//     const day = selectedDate.getUTCDate();

//     const [startHourStr, startMinStr] = formData.start_time.split(":");
//     const [endHourStr, endMinStr] = formData.end_time.split(":");
//     const startHour = parseInt(startHourStr, 10);
//     const startMin = parseInt(startMinStr, 10);
//     const endHour = parseInt(endHourStr, 10);
//     const endMin = parseInt(endMinStr, 10);

//     const startUTC = new Date(Date.UTC(year, month, day, startHour, startMin, 0));
//     const endUTC = new Date(Date.UTC(year, month, day, endHour, endMin, 0));

//     const meetingData = {
//       organizer_email,
//       client_emails: formData.inviteEmail,
//       subject: formData.title,
//       description: formData.description,
//       start_time: startUTC.toISOString(),
//       end_time: endUTC.toISOString(),
//     };

//     try {
//       setIsSaving(true);
//       if (modalType === "create") {
//         const result = await meetingAPI.createMeeting(meetingData);
//         if (result) {
//           setMeetings((prev) => [
//             ...prev,
//             {
//               id: result.meetingId || Date.now(),
//               title: result.subject,
//               date: formatDateLocal(new Date(result.start)),
//               start_time: result.start,
//               end_time: result.end,
//               inviteEmail: formData.inviteEmail,
//               description: result.description,
//             },
//           ]);
//           toast.success("Meeting created successfully!");

//           // 🖨️ Log the scheduled meeting details
//           console.log("✅ Scheduled Meeting:", {
//             title: result.subject,
//             description: result.description,
//             start_time: result.start,
//             end_time: result.end,
//             inviteEmail: formData.inviteEmail,
//             organizer_email,
//           });
//         }
//       } else if (modalType === "edit" && selectedMeeting) {
//         await meetingAPI.updateMeeting(selectedMeeting.id, meetingData);
//         setMeetings((prev) =>
//           prev.map((m) => (m.id === selectedMeeting.id ? { ...m, ...meetingData } : m))
//         );
//       }
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         setShowModal(false);
//       }, 5000);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving meeting:", error);
//       toast.error("Failed to create meeting.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const teamMembersList = [
//     { name: "Vinay Saraswat", email: "vinay.saraswat@onmeridian.com" },
//     { name: "Harsh Bhardwaj", email: "harsh.bhardwaj@onmeridian.com" },
//     { name: "Shivam Gupta", email: "shivam.gupta@onmeridian.com" },
//     { name: "Garvit Dang", email: "garvit.dang@onmeridian.com" },
//     // { name: "Bhoomi Shakya", email: "bhoomi.shakya@onmeridian.com" },
//     { name: "Rafik Mohammod", email: "rafik.mohammod@onmeridian.com" },
//   ];

//   const handleDelete = async () => {
//   if (!selectedMeeting) return;

//   if (window.confirm("Are you sure you want to cancel this meeting?")) {
//     try {
//       setIsSaving(true);

//       const result = await meetingAPI.deleteMeeting(
//         selectedMeeting.id,
//         organizer_email
//       );

//       if (result && result.status === "cancelled") {
//         toast.success("Meeting cancelled successfully!");
//         setMeetings((prev) => prev.filter((m) => m.id !== selectedMeeting.id));
//         setShowModal(false);
//         resetForm();
//       } else {
//         toast.error("Failed to cancel meeting on server.");
//       }
//     } catch (error) {
//       console.error("Error deleting meeting:", error);
//       toast.error("Error cancelling meeting.");
//     } finally {
//       setIsSaving(false);
//     }
//   }
// };


//   const resetForm = () => {
//     setFormData({
//       title: "",
//       start_time: "10:00",
//       end_time: "11:00",
//       attendees: "",
//       location: "",
//       amount: "",
//       description: "",
//       inviteEmail: [],
//     });
//     setSelectedMeeting(null);
//     setSelectedDate(new Date());
//   };

//   const navigateMonth = (direction) => {
//     setCurrentDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + direction);
//       return newDate;
//     });
//   };

//   const days = getDaysInMonth(currentDate);
//   const projectData = useSelector(selectSelectedProjectData);
//   return (
//     <div className="bg-gray-100 rounded-4xl p-6">
//       <Toaster position="top-right" />
//       <div className="flex items-center justify-between space-x-6 mb-6">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-yellow-100 rounded-lg">
//               <ChevronLeft size={20} className="text-gray-600" />
//             </button>
//             <div className="text-lg font-semibold text-gray-900">
//               {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//             </div>
//             <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-yellow-100 rounded-lg">
//               <ChevronRight size={20} className="text-gray-600" />
//             </button>
//           </div>

//           <div className="flex bg-gray-200 rounded-full p-1">
//             {["Daily", "Weekly", "Monthly"].map((view) => (
//               <button
//                 key={view}
//                 onClick={() => setViewMode(view)}
//                 className={`px-4 py-1.5 text-sm cursor-pointer font-medium rounded-full transition-all duration-300 ${viewMode === view ? "bg-gray-900 text-white shadow-sm" : "text-gray-700 hover:text-gray-900"
//                   }`}
//               >
//                 {view}
//               </button>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={() => {
//             setModalType("create");
//             setSelectedDate(new Date());
//             setShowModal(true);
//           }}
//           className="bg-gray-800 text-white px-4 py-2 rounded-4xl text-sm font-medium hover:bg-gray-900 transition-colors"
//         >
//           + New Schedule
//         </button>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 p-4">
//         <div className="grid grid-cols-7 gap-1 mb-2">
//           {dayNames.map((day) => (
//             <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-1">
//           {days.map((dayData, index) => {
//             const dayMeetings = getMeetingsForDate(dayData.date);
//             const isToday = formatDateLocal(dayData.date) === formatDateLocal(new Date());  // Fixed here

//             return (
//               <div
//                 key={index}
//                 onClick={() => handleDateClick(dayData.date, dayData)}
//                 className={`min-h-20 p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!dayData.isCurrentMonth ? "text-gray-400 bg-gray-50" : "bg-white"
//                   } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
//               >
//                 <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""}`}>
//                   {dayData.day}
//                 </div>

//                 {dayMeetings.length > 0 && (
//                   <div className="space-y-1">
//                     {dayMeetings.slice(0, 2).map((meeting) => (
//                       <div key={meeting.id} className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs truncate">
//                         <div className="font-medium">{meeting.title}</div>
//                         {meeting.amount && <div className="text-xs">{meeting.amount}</div>}
//                       </div>
//                     ))}
//                     {dayMeetings.length > 2 && <div className="text-xs text-gray-500">+{dayMeetings.length - 2} more</div>}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[2rem] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
//             {showSuccess ? (
//               <div className="flex flex-col items-center justify-center text-center py-8">
//                 <img
//                   src={calender}
//                   alt="Calendar"
//                   className="w-40 h-40 mb-6 "
//                 />
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   Meeting request sent successfully
//                 </h3>
//                 <p className="text-[#898989] text-sm mb-6">
//                   Your meeting has been scheduled. Participants will receive an invite.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setShowSuccess(false);
//                     setShowModal(false);
//                   }}
//                   className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <style>{`div::-webkit-scrollbar { display: none; }`}</style>
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     {modalType === "create"
//                       ? "Schedule New Meeting"
//                       : modalType === "edit"
//                       ? "Edit Meeting"
//                       : "Meeting Details"}
//                   </h3>
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       resetForm();
//                     }}
//                     className="p-2 hover:bg-gray-100 rounded-full"
//                   >
//                     <X size={20} className="text-gray-500" />
//                   </button>
//                 </div>

//                 {/* --- Meeting form --- */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Meeting Date *
//                     </label>
//                     <input
//                       type="date"
//                       name="meeting_date"
//                       value={selectedDate ? formatDateLocal(selectedDate) : ""}
//                       onChange={(e) => {
//                         const [year, month, day] = e.target.value.split("-");
//                         setSelectedDate(new Date(year, month - 1, day));
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       disabled={modalType === "view"}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Meeting Title *
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       placeholder="Enter meeting title"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       disabled={modalType === "view"}
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Start Time
//                       </label>
//                       <input
//                         type="time"
//                         name="start_time"
//                         value={formData.start_time}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         disabled={modalType === "view"}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         End Time
//                       </label>
//                       <input
//                         type="time"
//                         name="end_time"
//                         value={formData.end_time}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         disabled={modalType === "view"}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Invitee Emails
//                     </label>
//                     <div className="flex flex-wrap gap-2 items-center w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">

//                       {/* Display added emails */}
//                       {formData.inviteEmail.map((email, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
//                         >
//                           {email}
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 inviteEmail: prev.inviteEmail.filter((_, i) => i !== idx),
//                               }))
//                             }
//                             className="ml-2 text-red-500 hover:text-red-700"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ))}

//                       {/* Dropdown for team members */}
//                       <select
//                         className="flex-1 outline-none p-1 text-sm"
//                         onChange={(e) => {
//                           const selectedMember = teamMembersList.find(
//                             (m) => m.name === e.target.value
//                           );
//                           if (selectedMember && !formData.inviteEmail.includes(selectedMember.email)) {
//                             setFormData((prev) => ({
//                               ...prev,
//                               inviteEmail: [...prev.inviteEmail, selectedMember.email],
//                             }));
//                           }
//                           e.target.value = ""; // reset dropdown
//                         }}
//                       >
//                         <option value="">Select Team Member</option>
//                         {teamMembersList.map((member) => (
//                           <option key={member.email} value={member.name}>
//                             {member.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       placeholder="Meeting description"
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                       disabled={modalType === "view"}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
//                   {modalType === "view" ? (
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setModalType("edit")}
//                         className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                       >
//                         <Edit3 size={16} />
//                         <span>Edit</span>
//                       </button>
//                       <button
//                         onClick={handleDelete}
//                         className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                       >
//                         <Trash2 size={16} />
//                         <span>Delete</span>
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => {
//                           setShowModal(false);
//                           resetForm();
//                         }}
//                         className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSubmit}
//                         disabled={isSaving || !formData.title}
//                         className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {isSaving ? (
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <Save size={16} />
//                         )}
//                         <span>
//                           {modalType === "create" ? "Create Meeting" : "Save Changes"}
//                         </span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// const MeetingSchedule = () => {
//   return (
//     <div className="min-h-screen p-8 bg-cover bg-center bg-no-repeat -mt-[5rem]" style={{ backgroundImage: `url(${bgImageds})` }}>
//       <div className="mt-[5rem]">
//         <h1 className="text-2xl font-bold text-gray-900 mb-8">Schedule a Meeting</h1>
//         <MeetingScheduler />
//       </div>
//     </div>
//   );
// };
// export default VendorMeetingSchedule;
