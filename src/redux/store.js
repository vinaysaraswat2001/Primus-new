import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";

import {
  persistStore,
  persistReducer,
  createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

import userReducer, { logoutUser } from "./userSlice";
 
import projectReducer from "./projectSlice";
import projectTimelineReducer from "./projectTimelineSlice";
import feedBackReducer from "./feedBackSlice";
import teamsReducer from "./teamSlice";
import documentReducer from "./documentlibrarySlice";

// Optional: Transform to persist only minimal user info
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
  whitelist: ["user", "project", "teams"], // slices you want to persist
  transforms: [UserTransform],
};

// --- Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  timeline: projectTimelineReducer,
  teams: teamsReducer,
  documents: documentReducer,
  feedback: feedBackReducer,
});

const appReducer = (state, action) => {
  if (action.type === logoutUser.type) {
    // 🧹 Wipe persisted data from localStorage
    storage.removeItem("persist:root");
    // 🧩 Reset entire Redux state to initial values
    state = undefined;
  }
  return rootReducer(state, action);
};
 
const persistedReducer = persistReducer(persistConfig, appReducer);

// --- Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

// --- Create persistor
export const persistor = persistStore(store);

// Optional: expose for debugging in browser console
window.__store__ = store;
window.__persistor__ = persistor;

export default store;
