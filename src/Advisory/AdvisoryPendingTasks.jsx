import React, { useEffect, useState } from "react";

/* Simple doc icon to avoid extra deps */
const DocIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 13h8M8 17h8M8 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const StatusPill = ({ kind = "due", text = "" }) => {
  const styles = {
    due: {
      base: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
      dot: "bg-rose-500",
    },
    pending: {
      base: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      dot: "bg-amber-400",
    },
    daysLeft: {
      base: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
      dot: "bg-rose-500",
    },
  }[kind] || {
    base: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${styles.base}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${styles.dot}`} />
      {text}
    </span>
  );
};

const TaskRow = ({ title, pill, onClick }) => (
  <div
    className="flex items-center justify-between gap-3 px-3 py-3 rounded-lg hover:bg-white/60 transition cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-lg bg-[#102437] text-white flex items-center justify-center shrink-0">
        <DocIcon className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-800 truncate">{title}</p>
    </div>
    {pill && <StatusPill kind={pill.kind} text={pill.text} />}
  </div>
);

const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button
            className="px-3 py-1.5 text-sm rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-2 py-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function AdvisoryPendingTasks({
  title = "Pending Tasks",
  tasks: tasksProp,
  maxVisible = 5,
}) {
  // Sample data if none provided
  const [tasks] = useState(
    tasksProp ||
    [
      { id: 1, title: "Submit Monthly Report", pill: { kind: "due", text: "Due: 12 Aug" } },
      // { id: 2, title: "Invoice INV-0924", pill: { kind: "pending", text: "Pending Payment" } },
      { id: 3, title: "Internal Feedback Survey", pill: { kind: "daysLeft", text: "2 Days Left" } },
      { id: 4, title: "Submit Monthly Report", pill: { kind: "due", text: "Due: 12 Aug" } },
      { id: 5, title: "Submit Monthly Report", pill: { kind: "due", text: "Due: 12 Aug" } },
      { id: 6, title: "Submit Monthly Report", pill: { kind: "due", text: "Due: 12 Aug" } },
      { id: 7, title: "Vendor Agreement Renewal", pill: { kind: "due", text: "Due: 15 Aug" } },
      { id: 8, title: "Security Audit Checklist", pill: { kind: "daysLeft", text: "5 Days Left" } },
      // { id: 9, title: "Invoice INV-0930", pill: { kind: "pending", text: "Pending Payment" } },
    ]
  );

  const [open, setOpen] = useState(false);

  const visibleTasks = tasks.slice(0, maxVisible);

  return (
    <>
      <div className="rounded-2xl p-4 sm:p-7 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h2>
          {tasks.length > maxVisible && (
            <button
              className="text-sm font-semibold text-[#102437] hover:underline cursor-pointer"
              onClick={() => setOpen(true)}
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {visibleTasks.map((t) => (
            <TaskRow
              key={t.id}
              title={t.title}
              pill={t.pill}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Modal with all tasks */}
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="p-2 space-y-1">
          {tasks.map((t) => (
            <TaskRow key={t.id} title={t.title} pill={t.pill} onClick={() => {}} />
          ))}
        </div>
      </Modal>
    </>
  );
}