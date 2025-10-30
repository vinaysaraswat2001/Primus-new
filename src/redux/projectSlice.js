// src/store/slices/projectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// --- Utility: fetch with timeout
function fetchWithTimeout(resource, options = {}, timeout = 35000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(id)
  );
}

// --- Async thunk: Fetch all projects
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const clientEmail = localStorage.getItem("Email");
      if (!clientEmail) throw new Error("Missing client email");

      const res = await fetchWithTimeout(`${BACKEND_URL}/client/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ client_email: clientEmail }),
      });

      if (!res.ok) throw new Error((await res.text()) || "Failed to fetch projects");

      const data = await res.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch projects");
    }
  }
);

// --- Async thunk: Fetch project details (with caching)
export const fetchProjectDetails = createAsyncThunk(
  "project/fetchProjectDetails",
  async (projectId, thunkAPI) => {
    try {
      if (!projectId) throw new Error("Missing project id");

      // ✅ Check cache first
      const state = thunkAPI.getState();
      const cached = state.project.entities[projectId];
      if (cached) {
        console.debug("[Slice] Using cached project details for:", projectId);
        return { projectId, data: cached, fromCache: true };
      }

      const token = localStorage.getItem("authToken");
      const res = await fetchWithTimeout(
        `${BACKEND_URL}/client/${projectId}/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }
      );
      if (!res.ok)
        throw new Error((await res.text()) || "Failed to fetch project details");
      console.log("dashboard client info", res.data)
      const data = await res.json();
    
console.log("[✅ FETCHED PROJECT DETAILS]", data);
      return { projectId, data, fromCache: false };
    } catch (err) {
      return thunkAPI.rejectWithValue({ projectId, message: err.message });
    }
  }
);

const initialState = {
  client_id: null,
  client_name: null,
  projects: [],
  total_projects: 0,
  ongoing_projects: 0,
  completed_projects: 0,
  budget:0,
  sector:null,
  clientType:null,
  selectedId: null,
  entities: {}, // projectId => projectDetails
  status: "idle",
  statusById: {},
  error: null,
  errorById: {},
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject(state, action) {
      state.selectedId = action.payload;
    },
    clearProjects(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const d = action.payload || {};
        // console.log(d, "d");

        state.client_id = d.client_id ?? state.client_id;
        state.client_name = d.client_name ?? state.client_name;
        state.projects = d.projects ?? [];


        // ✅ persist totals from backend
        state.total_projects = d.total_projects ?? 0;
        state.ongoing_projects = d.ongoing_projects ?? 0;
        state.completed_projects = d.completed_projects ?? 0;
        state.totalOverallProjectValue = d.totalOverallProjectValue ?? 0        

        if (!state.selectedId && state.projects.length > 0) {
          state.selectedId = state.projects[0].project_id;
        }
        state.status = "succeeded";
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      // fetchProjectDetails
      .addCase(fetchProjectDetails.pending, (state, action) => {
        const id = action.meta.arg;
        state.statusById[id] = "loading";
        delete state.errorById[id];
      })
      // .addCase(fetchProjectDetails.fulfilled, (state, action) => {
      //   const { projectId, data, fromCache } = action.payload;
      //   if (!fromCache) {
      //     // console.log("storing fresh project details for", projectId, data);
      //     state.entities[projectId] = data;
      //     // ✅ Store these fields
      //   state.sector = data?.sector ?? null;
      //   state.clientType = data?.clientType ?? null;
      //       } else {
      //     console.log("using cached project details for", projectId);
      //   }
      //   state.statusById[projectId] = "succeeded";
      //   state.errorById[projectId] = null;
      //   state.selectedId = projectId;
      // })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
  const { projectId, data, fromCache } = action.payload;
  if (!fromCache) {
    state.entities[projectId] = data;
    state.sector = data?.sector ?? null;
    state.clientType = data?.clientType ?? null;
  }
  state.statusById[projectId] = "succeeded";
  state.errorById[projectId] = null;
  state.selectedId = projectId;
})
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        const payload = action.payload || {};
        const id = payload.projectId || action.meta.arg;
        state.statusById[id] = "failed";
        state.errorById[id] =
          payload.message || action.error?.message || "Failed";
      });
  },
});

// --- Actions ---
export const { setSelectedProject, clearProjects } = projectSlice.actions;

// --- Selectors ---
export const selectProjectList = (state) => state.project.projects;
export const selectSelectedProjectId = (state) => state.project.selectedId;
export const selectSelectedProjectData = (state) =>
  state.project.selectedId
    ? state.project.entities?.[state.project.selectedId] ?? null
    : null;
export const selectStatusById = (projectId) => (state) =>
  state.project.statusById?.[projectId] ?? "idle";
export const selectErrorById = (projectId) => (state) =>
  state.project.errorById?.[projectId] ?? null;

// ✅ new selectors for totals
export const selectTotals = (state) => ({
  total: state.project.total_projects,
  ongoing: state.project.ongoing_projects,
  completed_projects: state.project.completed_projects,
  budget: state.project.totalOverallProjectValue

});


// --- Selector to get team members of selected project ---
export const selectTeamMembersOfSelectedProject = (state) =>
  state.project.selectedId
    ? state.project.entities?.[state.project.selectedId]?.members ?? []
    : [];

export default projectSlice.reducer;
