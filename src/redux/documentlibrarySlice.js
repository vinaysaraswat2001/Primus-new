import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// --- Async thunk to fetch documents for a project
export const fetchProjectDocuments = createAsyncThunk(
  "documents/fetchProjectDocuments",
  async (projectNo, thunkAPI) => {
    try {
      if (!projectNo) throw new Error("Missing project number");

      const token = localStorage.getItem("authToken");

      const res = await fetch(`${BACKEND_URL}/client/project/${projectNo}/document-attachments`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Failed to fetch documents (${res.status})`);
      }

      const documents = await res.json();
      return { projectNo, documents };
    } catch (err) {
      return thunkAPI.rejectWithValue({ projectNo, message: err.message });
    }
  }
);

// --- Slice
const documentSlice = createSlice({
  name: "documents",
  initialState: {
    entities: {}, // projectNo => { documents }
    statusById: {},
    errorById: {},
  },
  reducers: {
    clearDocumentsForProject(state, action) {
      const projectNo = action.payload;
      delete state.entities[projectNo];
      delete state.statusById[projectNo];
      delete state.errorById[projectNo];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDocuments.pending, (state, action) => {
        const projectNo = action.meta.arg;
        state.statusById[projectNo] = "loading";
        delete state.errorById[projectNo];
      })
      .addCase(fetchProjectDocuments.fulfilled, (state, action) => {
        const { projectNo, documents } = action.payload;
        state.entities[projectNo] = { documents };
        state.statusById[projectNo] = "succeeded";
      })
      .addCase(fetchProjectDocuments.rejected, (state, action) => {
        const { projectNo, message } = action.payload || {};
        if (projectNo) {
          state.statusById[projectNo] = "failed";
          state.errorById[projectNo] = message || action.error?.message || "Failed to fetch documents";
        }
      });
  },
});

export const { clearDocumentsForProject } = documentSlice.actions;

// --- Selectors
export const selectDocumentsByProject = (projectNo) => (state) =>
  projectNo ? state.documents.entities[projectNo]?.documents || [] : [];

export const selectDocumentStatusByProject = (projectNo) => (state) =>
  projectNo ? state.documents.statusById[projectNo] || "idle" : "idle";

export const selectDocumentErrorByProject = (projectNo) => (state) =>
  projectNo ? state.documents.errorById[projectNo] || null : null;

export default documentSlice.reducer;
