import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchInvoiceData = createAsyncThunk(
  "invoices/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const AUTH_TOKEN = localStorage.getItem("authToken");
      const ORGANIZER_EMAIL = localStorage.getItem("Email");

      const response = await fetch(`${BACKEND_URL}/vendor/invoice-orders-dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ vendor_email: ORGANIZER_EMAIL }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to fetch invoices");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// Fetch line details
export const fetchInvoiceLines = createAsyncThunk(
  "invoices/fetchInvoiceLines",
  async (invoiceNo, { rejectWithValue }) => {
    try {
      const AUTH_TOKEN = localStorage.getItem("authToken");
      const ORGANIZER_EMAIL = localStorage.getItem("Email");

      const res = await fetch(`${BACKEND_URL}/vendor/invoice-line-orders-dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          document_no: invoiceNo,
          vendor_email: ORGANIZER_EMAIL,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch invoice lines");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Submit new invoice
export const submitInvoice = createAsyncThunk(
  "invoices/submitInvoice",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/vendor/submit-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to submit invoice");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    data: null,
    selectedInvoice: null,
    loading: false,
    error: null,
    submitSuccess: false,
  },
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    resetSubmitState: (state) => {
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInvoiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchInvoiceLines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceLines.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = {
          documentNo: action.payload.documentNo,
          subtotal: action.payload.subtotal,
          discounts_total: action.payload.discounts_total,
          net_payable: action.payload.net_payable,
          items: action.payload.items || [],
        };
      })
      .addCase(fetchInvoiceLines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitInvoice.pending, (state) => {
        state.loading = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(submitInvoice.fulfilled, (state) => {
        state.loading = false;
        state.submitSuccess = true;
      })
      .addCase(submitInvoice.rejected, (state, action) => {
        state.loading = false;
        state.submitSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedInvoice, resetSubmitState } = invoiceSlice.actions;
export default invoiceSlice.reducer;