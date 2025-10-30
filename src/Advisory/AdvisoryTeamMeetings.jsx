import { useState, useEffect } from "react";
import { Clock, Users, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const teamMembersList = [
  { name: "Shivam Gupta", email: "shivam.gupta@onmeridian.com" },
];

const AdvisoryTeamMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentView, setCurrentView] = useState("Timeline");

  // Modal form
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // could be "view" for future
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    inviteEmail: [],
    description: "",
  });

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Dummy meetings for demo
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const dummyMeetings = [
        {
          id: 1,
          title: "Advisory Board Strategy Session",
          startDate: new Date("2025-12-16T09:00:00"),
          endDate: new Date("2025-12-16T10:00:00"),
          startTime: "09:00",
          endTime: "10:00",
          duration: 60,
          color: "bg-blue-500",
          attendees: ["Alice", "John", "Ravi"],
          location: "Conference Room A",
          status: "Upcoming",
        },
      ];
      setMeetings(dummyMeetings);
      setLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleMeeting = () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Convert start & end time to Date objects
    const [startHour, startMinute] = formData.start_time.split(":");
    const [endHour, endMinute] = formData.end_time.split(":");
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHour, startMinute);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHour, endMinute);

    const newMeeting = {
      id: Date.now(),
      title: formData.title,
      startDate: startDateTime,
      endDate: endDateTime,
      startTime: formData.start_time,
      endTime: formData.end_time,
      color: "bg-green-500",
      attendees: formData.inviteEmail,
      location: "TBD",
      status: "Upcoming",
      description: formData.description,
    };

    setMeetings((prev) => [...prev, newMeeting]);
    toast.success("Meeting scheduled successfully!");
    setShowModal(false);
    setFormData({ title: "", start_time: "", end_time: "", inviteEmail: [], description: "" });
  };

  const calculateMeetingStyle = (meeting) => {
    const dayStartMinutes = 8 * 60;
    const dayEndMinutes = 18 * 60;
    const totalDayMinutes = dayEndMinutes - dayStartMinutes;

    const startMinutes =
      meeting.startDate.getHours() * 60 + meeting.startDate.getMinutes();
    const endMinutes =
      meeting.endDate.getHours() * 60 + meeting.endDate.getMinutes();

    const left = ((startMinutes - dayStartMinutes) / totalDayMinutes) * 100;
    const width = ((endMinutes - startMinutes) / totalDayMinutes) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.max(width, 5)}%`,
    };
  };

  if (loading) return <div className="text-center p-10">Loading meetings...</div>;
  if (error) return <div className="text-red-600 p-10">Error loading meetings: {error}</div>;

  return (
    <div className="bg-white h-[26rem] p-4 rounded-3xl">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView("Timeline")}
            className={`px-4 py-2 text-sm rounded-lg ${
              currentView === "Timeline"
                ? "bg-[#102437] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setCurrentView("Calendar")}
            className={`px-4 py-2 text-sm rounded-lg ${
              currentView === "Calendar"
                ? "bg-[#102437] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Calendar
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer px-4 py-2 bg-[#102437] text-white rounded-lg"
          >
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {currentView === "Timeline" && (
        <div className="relative border border-gray-200 p-2 rounded-lg">
          <div className="absolute inset-0 flex">
            {timeSlots.map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-gray-200 last:border-r-0"
              />
            ))}
          </div>
          <div className="relative z-10 min-h-[150px]">
            {meetings.map((meeting, i) => {
              const style = calculateMeetingStyle(meeting);
              return (
                <div
                  key={meeting.id}
                  className={`absolute group rounded-xl px-3 py-2 shadow-md text-white text-sm font-medium truncate cursor-pointer transition-all duration-200 ${meeting.color}`}
                  style={{
                    top: `${i * 70}px`,
                    left: style.left,
                    width: style.width,
                    minWidth: "200px",
                    height: "64px",
                  }}
                >
                  <div>{meeting.title}</div>
                  <div className="text-xs font-normal opacity-90">
                    {meeting.startTime} - {meeting.endTime} ({meeting.status})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {currentView === "Calendar" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`${meeting.color} rounded-xl p-4 text-white shadow-md`}
            >
              <div className="font-semibold mb-2">{meeting.title}</div>
              <div className="text-sm opacity-90 space-y-1">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {meeting.startTime} - {meeting.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{meeting.attendees.length} attendees</span>
                </div>
                <div>Status: {meeting.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Schedule New Meeting</h3>

            {/* --- Form --- */}
            <div className="space-y-4">
              {/* Meeting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Date *
                </label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Meeting Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter meeting title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Invitee Emails */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitee Emails
                </label>
                <div className="flex flex-wrap gap-2 items-center w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
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
                  <select
                    className="flex-1 outline-none p-1 text-sm"
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
                      e.target.value = "";
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Meeting description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer px-4 py-2 text-gray-700 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  className="cursor-pointer px-4 py-2 bg-[#102437] text-white rounded-lg "
                >
                  Create Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisoryTeamMeetings