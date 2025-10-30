// src/pages/TimelinePhases.jsx
import { useEffect } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  PlayCircle,
  Target,
  Rocket
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeline } from "../../redux/projectTimelineSlice";

// --- Timeline Component ---
const ProjectPhaseTimeline = ({ projectId }) => {
  const dispatch = useDispatch();

  // Select timeline data from Redux store safely
  const timeline = useSelector(
    (s) => s.timeline?.timelines?.[projectId] ?? null
  );  
  const status = useSelector(
    (s) => s.timeline?.status?.[projectId] ?? "idle"
  );
  const error = useSelector(
    (s) => s.timeline?.error?.[projectId] ?? null
  );

  console.log("here is timeline", timeline)
  useEffect(() => {
    if (projectId && status !== "succeeded" && status !== "loading") {
      dispatch(fetchTimeline(projectId));
    }
  }, [dispatch, projectId, status]);

  const getPhaseIcon = (name, phaseStatus) => {
    const iconProps = {
      size: 20,
      className:
        phaseStatus === "completed" || phaseStatus === "ongoing"
          ? "text-white"
          : "text-gray-400",
    };
    const icons = {
      target: <Target {...iconProps} />,
      users: <Users {...iconProps} />,
      play: <PlayCircle {...iconProps} />,
      check: <CheckCircle {...iconProps} />,
      rocket: <Rocket {...iconProps} />,
    };
    return icons[name] || <Clock {...iconProps} />;
  };

  const styleFor = (phaseStatus) =>
    phaseStatus === "completed"
      ? {
        dot: "bg-green-600 border-green-600",
        line: "bg-green-600",
        text: "text-gray-900",
        date: "text-gray-600",
      }
      : phaseStatus === "ongoing"
        ? {
          dot: "bg-blue-600 border-blue-600 ring-4 ring-blue-200",
          line: "bg-blue-600",
          text: "text-blue-600 font-semibold",
          date: "text-blue-600",
        }
        : {
          dot: "bg-gray-300 border-gray-300",
          line: "bg-gray-300",
          text: "text-gray-400",
          date: "text-gray-400",
        };

  // Loading skeleton
  if (status === "loading" || status === "idle")
    return (
      <div className="bg-white rounded-xl p-6 max-w-4xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-start justify-between mb-8">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
              <div className="h-4 w-16 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-10 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Loading…
          </div>
        </div>
      </div>
    );

  // Error state
  if (status === "failed")
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  if (!timeline)
    return <div className="p-6 text-center text-gray-400">No project selected</div>;

  // Render timeline
  return (
    <div className="bg-white rounded-xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Project Phase</h2>
        <div className="text-2xl font-bold text-gray-900">
          {timeline.currentPhase}/{timeline.totalPhases}
        </div>
      </div>

      {/* Phases */}
      <div className="relative">
        <div className="flex items-start justify-between mb-8 relative">
          {timeline.phases.map((phase, idx) => {
            const s = styleFor(phase.status);
            const isLast = idx === timeline.phases.length - 1;
            return (
              <div key={phase.id} className="flex flex-col items-center relative">
                {!isLast && (
                  <div
                    className={`absolute top-6 left-12 h-0.5 ${timeline.phases[idx + 1].status !== "pending"
                        ? s.line
                        : "bg-gray-300"
                      }`}
                    style={{
                      width: `calc(${100 / (timeline.phases.length - 1)}vw - 3rem)`,
                      maxWidth: "200px",
                    }}
                  />
                )}

                <div className="text-center max-w-24">
                  <div className={`text-xs font-medium mb-1 ${s.text}`}>
                    {phase.title}
                  </div>
                  <div className={`text-xs ${s.date}`}>{phase.date}</div>
                  {/* Status */}
                  <div className="text-right">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${phase.status === "completed"
                                                ? "bg-[#2EB832]/20 text-[#2EB832]"
                                                : "bg-[#F23636]/20 text-[#F23636]"
                                            }`}
                                    >
                                        {phase.status === "completed" ? "Completed" : "Due"}
                                    </span>
                                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-10 relative">
          <div
            className={`h-10 rounded-full transition-all duration-500 ease-out ${timeline.completionPercentage > 0 ? "bg-[#F4B472]" : "bg-gray-200"
              }`}
            style={{ width: `${timeline.completionPercentage}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-black">
            {timeline.completionPercentage}% project completed
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function TimelinePhases() {
  const selectedProjectId = useSelector((s) => s.project.selectedId);
  // console.log("TimelinePhases Redux projectId:", selectedProjectId);

  return (
    <div className="p-0 max-w-6xl mx-auto">
      <ProjectPhaseTimeline projectId={selectedProjectId} />
    </div>
  );
}
