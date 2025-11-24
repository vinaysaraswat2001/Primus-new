// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";
import {
  persistStore,
  persistReducer,
  createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// --- Import all slices
import userReducer, { logoutUser } from "./userSlice";
import projectReducer from "./projectSlice";
import projectTimelineReducer from "./projectTimelineSlice";
import feedBackReducer from "./feedBackSlice";
import teamsReducer from "./teamSlice";
import documentReducer from "./documentlibrarySlice";
import invoiceReducer from "./invoiceSlice"; 
import vendorDashboardReducer from "./vendorDashboardSlice";


// --- Optional: Transform to persist only minimal user info
const UserTransform = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    return {
      email: inboundState.email ?? null,
      authToken: inboundState.authToken ?? null,
      isAuthenticated: inboundState.isAuthenticated ?? false,
    };
  },
  (outboundState, key) => outboundState,
  { whitelist: ["user"] } // only apply to user slice
);

// --- Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "project", "teams", "invoices"], // ✅ added "invoices" so it’s persisted
  transforms: [UserTransform],
};

// --- Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  timeline: projectTimelineReducer,
  teams: teamsReducer,
  documents: documentReducer,
  feedback: feedBackReducer,
  invoices: invoiceReducer,
  vendorDashboard: vendorDashboardReducer,
});

// --- Reset Redux + Persisted storage on logout
const appReducer = (state, action) => {
  if (action.type === logoutUser.type) {
    storage.removeItem("persist:root"); // clears localStorage
    state = undefined; // resets redux state
  }
  return rootReducer(state, action);
};

// --- Persisted reducer wrapper
const persistedReducer = persistReducer(persistConfig, appReducer);

// --- Configure Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

// --- Create persistor for redux-persist
export const persistor = persistStore(store);

// --- Optional: expose for debugging in browser console
if (typeof window !== "undefined") {
  window.__store__ = store;
  window.__persistor__ = persistor;
}

export default store;