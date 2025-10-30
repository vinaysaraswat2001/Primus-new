// redux/feedbackSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Submit feedback thunk
export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/client/feedback`, payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    category: "",
    rating: 0,
    comments: "",
    teamMember: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setCategory: (state, action) => { state.category = action.payload; },
    setRating: (state, action) => { state.rating = action.payload; },
    setComments: (state, action) => { state.comments = action.payload; },
    setTeamMember: (state, action) => { state.teamMember = action.payload; },
    resetFeedback: (state) => {
      state.category = "";
      state.rating = 0;
      state.comments = "";
      state.teamMember = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => { state.status = "loading"; })
      .addCase(submitFeedback.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCategory, setRating, setComments, setTeamMember, resetFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
