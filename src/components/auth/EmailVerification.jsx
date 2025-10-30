// src/pages/Login/EmailVerification.jsx
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 
const EmailVerification = ({ email, otpSessionId, onBack, onVerified, userType }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("⚠️ Please enter OTP");
      return;
    }
 
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/login/verify`,
        { email, otp, type: userType, sessionId: otpSessionId },
        { withCredentials: true }
      );
 
      const data = response.data;
 
      if (data.access_token) {
        toast.success("🎉 OTP verified successfully!");
        onVerified(data.access_token);
      } else {
        toast.error(data.message || "❌ Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-tr from-indigo-50 via-white to-pink-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-extrabold mb-4 text-[#102437] text-center">OTP Verification</h1>
        <p className="mb-6 text-center text-gray-600">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>
 
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="border border-gray-300 rounded-lg px-5 py-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 text-lg transition-all duration-200"
        />
 
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="cursor-pointer px-5 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200 transform hover:-translate-y-1"
          >
            Back
          </button>
 
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="cursor-pointer px-5 py-3 bg-[#102437] text-white font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition duration-200 transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
 
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};
 
export default EmailVerification;
 