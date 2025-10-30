// src/pages/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerification from "./EmailVerification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginBg from "../../assets/loginbg.png";
import loginLeftImage from "../../assets/loginleft.png";
import Primuslogo from "../../assets/primuslogo.png";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import axios from "axios";
 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  // -------- State --------
  const [showPassword, setShowPassword] = useState(false);
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [otpSessionId, setOtpSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState("client"); // default
  const USER_TYPES = ["client", "vendor", "alumni", "advisor"]; // all types
 
  // -------- Validate token on mount --------
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      const savedEmail = localStorage.getItem("Email");
      const savedUserType = localStorage.getItem("userType");
 
      if (token && savedEmail) {
        const type = savedUserType || "client";
        dispatch(setUser({ email: savedEmail, authToken: token, userType: type }));
        navigate(getDashboardRoute(type));
      }
    };
    validateToken();
  }, [dispatch, navigate]);
 
  // -------- Helper: Get dashboard route --------
  const getDashboardRoute = (type) => {
    switch (type) {
      case "vendor":
        return "/vendor-dashboard";
      case "alumni":
        return "/alumni-home";
      case "advisor":
        return "/advisory-dashboard";
      default:
        return "/dashboard";
    }
  };
 
  // -------- Handle login --------
  const handleLoginClick = async () => {
    if (!email || !password) {
      toast.error("⚠️ Enter both email and password.");
      return;
    }
    if (!captchaValue) {
      toast.error("⚠️ Please verify reCAPTCHA.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { email, password, type: userType, captcha_token: captchaValue },
        { withCredentials: true }
      );
      
      const data = res.data;
      setOtpSessionId(data.sessionId);
      setScreen("verification");
      toast.info("OTP sent to your email.");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
 console.log(captchaValue)
  // -------- Handle OTP verified --------
  const handleOtpVerified = (jwtToken) => {
    dispatch(setUser({ email, authToken: jwtToken, userType }));
    localStorage.setItem("userType", userType);
    navigate(getDashboardRoute(userType));
  };
 
  // -------- Handle CAPTCHA --------
  const handleCaptchaChange = (value) => setCaptchaValue(value);
 
  // -------- OTP Screen --------
  if (screen === "verification") {
    return (
      <EmailVerification
        onBack={() => setScreen("login")}
        onVerified={handleOtpVerified}
        email={email}
        otpSessionId={otpSessionId}
        userType={userType}
      />
    );
  }
 
  // -------- Login Form --------
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
 
      {/* Left Illustration */}
      <div className="md:w-1/2 relative flex items-center justify-center z-10">
        {/* Back & Forward Buttons */}
        <div className="absolute top-13 left-16 flex gap-6">
          <button
            className="border cursor-pointer p-2 bg-white rounded-full shadow hover:bg-gray-100"
            onClick={() => console.log("Back clicked")}
          >
            {/* You can use an SVG or an icon library like Lucide or Heroicons */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
 
          <button
            className="cursor-pointer border p-2 bg-white rounded-full shadow hover:bg-gray-100"
            onClick={() => console.log("Forward clicked")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
 
        {/* Illustration */}
        <img
          src={loginLeftImage}
          alt="Illustration"
          className="h-auto w-[35rem] max-h-[95vh]"
        />
      </div>
 
      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center px-6 z-10">
        <div className="w-full max-w-md space-y-6 text-center">
          <img src={Primuslogo} alt="Logo" className="h-40 w-40 object-contain mx-auto" />
          <h1 className="text-2xl text-[#102437] mb-6 -mt-[4rem]">
            <span className="font-bold">Welcome</span>{" "}
            <span className="font-normal">to Your Personalized</span>{" "}
            <span className="font-bold">Primus</span>{" "}
            <span className="font-normal">Experience!</span>
          </h1>
 
          {/* User Type Selector */}
          <div className="flex justify-center mb-4 gap-4 flex-wrap">
            {USER_TYPES.map((type) => (
              <button
                key={type}
                className={`cursor-pointer px-4 py-2 rounded-full font-semibold ${userType === type ? "bg-[#102437] text-white" : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => setUserType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
 
          {/* Email */}
          <div className="text-left">
            <label className="block text-sm sm:text-base text-[#102437] mb-2">Email</label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-3 text-gray-600 text-lg" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-[#F5F5F5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD8051]"
              />
            </div>
          </div>
 
          {/* Password */}
          <div className="text-left">
            <label className="block text-sm sm:text-base text-[#102437] mb-2">Password</label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-3 text-gray-600 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-3 w-full bg-[#F5F5F5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD8051]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-600 focus:outline-none hover:text-[#AD8051]"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
 
          {/* Remember / Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox text-[#AD8051] focus:ring-[#AD8051] cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-[#102437]">Remember me</span>
            </label>
            <button
              className="text-[#102437] hover:text-[#0F1C2E] hover:underline transition-colors cursor-pointer"
              onClick={() => setCaptchaValue(null)}
            >
              Forgot password?
            </button>
          </div>
 
          {/* reCAPTCHA */}
          <div className="flex justify-center mb-6">
            <ReCAPTCHA sitekey="6LdQFoUrAAAAAPtwk0GeFVhA7fUenVLtedLApb55" onChange={handleCaptchaChange} />
          </div>
 
          {/* Login Button */}
          <button
            className="mb-4 w-full py-3 rounded-md font-semibold text-lg text-white hover:bg-[#6B2C1E] flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: "#102437" }}
            onClick={handleLoginClick}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
 
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};
 
export default Login;
 