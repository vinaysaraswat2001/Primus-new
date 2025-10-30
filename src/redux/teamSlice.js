import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// --- Async thunk
export const fetchTeamMembersOnly = createAsyncThunk(
  "teams/fetchTeamMembersOnly",
  async (projectNo, thunkAPI) => {
    try {
      if (!projectNo) throw new Error("Missing project number");
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${BACKEND_URL}/client/project/${projectNo}/team-members`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Failed to fetch team (${res.status})`);
      }

      const members = await res.json();
      return { projectNo, members };
    } catch (err) {
      return thunkAPI.rejectWithValue({ projectNo, message: err.message });
    }
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState: {
    entities: {}, // projectNo => { members }
    statusById: {},
    errorById: {},
  },
  reducers: {
    clearTeamForProject(state, action) {
      const projectNo = action.payload;
      delete state.entities[projectNo];
      delete state.statusById[projectNo];
      delete state.errorById[projectNo];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembersOnly.pending, (state, action) => {
        const projectNo = action.meta.arg;
        state.statusById[projectNo] = "loading";
        delete state.errorById[projectNo];
      })
      .addCase(fetchTeamMembersOnly.fulfilled, (state, action) => {
        const { projectNo, members } = action.payload;
        state.entities[projectNo] = { members };
        state.statusById[projectNo] = "succeeded";
      })
      .addCase(fetchTeamMembersOnly.rejected, (state, action) => {
        const { projectNo, message } = action.payload || {};
        if (projectNo) {
          state.statusById[projectNo] = "failed";
          state.errorById[projectNo] = message || action.error?.message || "Failed to fetch team";
        }
      });
  },
});

export const { clearTeamForProject } = teamsSlice.actions;

export const selectTeamByProject = (projectNo) => (state) =>
  projectNo ? state.teams.entities[projectNo] || { members: [] } : { members: [] };

export const selectTeamStatusByProject = (projectNo) => (state) =>
  projectNo ? state.teams.statusById[projectNo] || "idle" : "idle";

export const selectTeamErrorByProject = (projectNo) => (state) =>
  projectNo ? state.teams.errorById[projectNo] || null : null;

export default teamsSlice.reducer;
