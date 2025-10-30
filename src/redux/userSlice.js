// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
 
const initialState = {
  email: localStorage.getItem("Email") || null,
  authToken: localStorage.getItem("authToken") || null,
  userType: localStorage.getItem("userType") || null, // new: store client/vendor
  isAuthenticated: !!localStorage.getItem("authToken"),
};
 
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { email, authToken, userType } = action.payload;
 
      state.email = email;
      state.authToken = authToken;
      state.userType = userType;
      state.isAuthenticated = true;
 
      localStorage.setItem("Email", email);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userType", userType); // persist userType
    },
 
    logoutUser: (state) => {
      state.email = null;
      state.authToken = null;
      state.userType = null;
      state.isAuthenticated = false;
 
      localStorage.removeItem("Email");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
    },
  },
});
 
export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
 
 