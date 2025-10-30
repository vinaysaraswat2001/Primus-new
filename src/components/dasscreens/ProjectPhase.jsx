// src/pages/ProjectPhase.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeline } from "../../redux/projectTimelineSlice";

import step1 from "../../assets/step1.png";
import step2 from "../../assets/step3.png";
import step3 from "../../assets/step4.png";
import step4 from "../../assets/step5.png";
import check from "../../assets/Check.png";
import Flag from "../../assets/Flag.png";
import Spinner from "../../assets/Spinner.png";

const ProjectPhaseTimeline = ({ projectId }) => {
  const dispatch = useDispatch();

  const timeline = useSelector((s) => s.timeline?.timelines?.[projectId] ?? null);
  const status = useSelector((s) => s.timeline?.status?.[projectId] ?? "idle");
  const error = useSelector((s) => s.timeline?.error?.[projectId] ?? null);

  // Only consider loading if timeline is missing
  const isLoading = !timeline && status === "loading";

  useEffect(() => {
    if (projectId && !timeline && status !== "loading") {
      dispatch(fetchTimeline(projectId));
    }
  }, [dispatch, projectId, status, timeline]);

  const getPhaseIcon = (index) => {
    const icons = [step1, step2, step3, step4];
    const image = icons[index] || step1;
    return <img src={image} alt={`Phase ${index + 1}`} className="w-6 h-6" />;
  };

  const styleFor = (phaseStatus) =>
    phaseStatus === "completed"
      ? {
          dot: "bg-[#24C041] border-black",
          line: "bg-black",
          text: "text-black font-semibold",
          date: "text-gray-500",
        }
      : phaseStatus === "ongoing"
      ? {
          dot: "bg-[#F4B472] border-yellow-400 ring-4 ring-yellow-100",
          line: "bg-yellow-400",
          text: "text-yellow-500 font-semibold",
          date: "text-yellow-500",
        }
      : {
          dot: "bg-[#F4B472] border-gray-300",
          line: "bg-gray-300",
          text: "text-gray-400",
          date: "text-gray-400",
        };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 max-w-4xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-start justify-between mb-8">
          {[...Array(5)].map((_, idx) => (
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
  }

  if (status === "failed")
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  if (!timeline)
    return <div className="p-6 text-center text-gray-400">No project selected</div>;

  return (
    <div className="bg-white h-[56vh] rounded-xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Project Phase</h2>
        <div className="flex gap-2 items-center">
          {/* <div className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 bg-[#24C041] rounded-full">
            <img src={check} alt="Complete" className="w-3 h-3" />
            Complete
          </div>
          <div className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 bg-[#FFB240] rounded-full">
            <img src={Spinner} alt="In Progress" className="w-3 h-3" />
            In Progress
          </div> */}
          {/* <div className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 bg-[#8038FF] rounded-full">
            <img src={Flag} alt="Pending" className="w-3 h-3" />
            Pending
          </div> */}
          <div className="text-3xl font-bold text-gray-900 ml-4">
            {timeline.currentPhase}/{timeline.totalPhases}
          </div>
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
                    className={`absolute top-6 left-12 h-0.5 ${
                      timeline.phases[idx + 1].status !== "pending" ? s.line : "bg-gray-300"
                    }`}
                    style={{
                      width: `calc(${100 / (timeline.phases.length - 1)}vw - 3rem)`,
                      maxWidth: "200px",
                    }}
                  />
                )}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${s.dot} mb-3 relative z-10`}
                >
                  {getPhaseIcon(idx)}
                </div>

                <div className="text-center max-w-40">
                  <div className={`text-md font-base mb-1`}>{phase.title}</div>
                  <div className={`text-sm ${s.date}`}>
                    {phase.date?.split("→").pop().trim()}
                  </div>
                  <div>
                    {/* {phase.status === "completed" ? (
                      <div className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 bg-[#24C041] rounded-full">
                        <img src={check} alt="Completed" className="w-3 h-3" />
                        Complete
                      </div>
                    ) : phase.status === "ongoing" ? (
                      <div className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 bg-[#FFB240] rounded-full">
                        <img src={Spinner} alt="Ongoing" className="w-3 h-3" />
                        In Progress
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 bg-[#8038FF] rounded-full">
                        <img src={Flag} alt="Pending" className="w-3 h-3" />
                        Pending
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 mt-[5rem] rounded-full h-10 relative">
          <div
            className={`h-10 rounded-full transition-all duration-500 ease-out ${
              timeline.completionPercentage > 0 ? "bg-[#F4B472]" : "bg-gray-200"
            }`}
            style={{ width: `${timeline.completionPercentage}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
            {timeline.completionPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ProjectPhase() {
  const selectedProjectId = useSelector((s) => s.project.selectedId);

  return (
    <div className="p-0 max-w-6xl">
      <ProjectPhaseTimeline projectId={selectedProjectId} />
    </div>
  );
}
