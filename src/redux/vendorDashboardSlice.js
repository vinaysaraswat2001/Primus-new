// src/redux/vendorDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


// --- Thunk to fetch vendor dashboard data
export const fetchVendorDashboard = createAsyncThunk(
  "vendorDashboard/fetch",
  async (vendorEmail, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/vendor/purchase-orders-dashboard`,
        { vendor_email: vendorEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Vendor dashboard response:", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching dashboard data");
    }
  }
);

const vendorDashboardSlice = createSlice({
  name: "vendorDashboard",
  initialState: {
    data: {
      total_orders: 0,
      open_orders: 0,
      released_orders: 0,
      pending_approval_orders: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          total_orders: action.payload.total_orders,
          open_orders: action.payload.open_orders,
          released_orders: action.payload.released_orders,
          pending_approval_orders: action.payload.pending_approval_orders,
        };
      })
      .addCase(fetchVendorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vendorDashboardSlice.reducer;