// src/redux/projectTimelineSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchTimeline = createAsyncThunk(
  "timeline/fetchTimeline",
  async (projectId) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${BACKEND_URL}/client/${projectId}/dashboard`, {
/* The code snippet you provided is setting up headers for a fetch request in JavaScript. Here's what
each part is doing: */
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch project timeline");
    const data = await res.json();
    console.log("new response", data)

    return {
      projectId,
      data: {
        projectId: data.projectNo,
        currentPhase: data.phases.filter((p) => p.status === "completed" || p.status === "ongoing").length,
        totalPhases: data.phases.length,
        completionPercentage: data.progress_percent,
        phases: data.phases.map((p, idx) => ({
          id: idx + 1,
          title: p.phaseName,
          date: `${p.startDate} → ${p.endDate}`,
          status: p.status,
          actualBillingAmount:p.actualBillingAmount,
          remainingAmount: p.remainingAmount,
          completedAmount: p.completedAmount,
          icon: idx === 0 ? "target" : idx === data.phases.length - 1 ? "rocket" : p.status === "completed" ? "check" : "play",
        })),
      },
    };
  }
);

const projectTimelineSlice = createSlice({
  name: "timeline",
  initialState: {
    timelines: {}, // projectId => timeline data
    status: {},    // projectId => loading | succeeded | failed
    error: {},     // projectId => error message
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeline.pending, (state, action) => {
        state.status[action.meta.arg] = "loading";
      })
      .addCase(fetchTimeline.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state.timelines[projectId] = data;
        state.status[projectId] = "succeeded";
      })
      .addCase(fetchTimeline.rejected, (state, action) => {
        state.status[action.meta.arg] = "failed";
        state.error[action.meta.arg] = action.error.message;
      });
  },
});

export default projectTimelineSlice.reducer;
