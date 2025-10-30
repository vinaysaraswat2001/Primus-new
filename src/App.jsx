// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "animate.css";
 
// Client Components
import Login from "./components/auth/Login";
import Dasone from "./components/dasscreens/Dasone";
import Editprologin from "./components/dasscreens/Editprologin";
import EditProfile from "./components/dasscreens/EditProfile";
import Homepage from "./components/LandingPage/Homepage";
import Dashboard from "./components/dasscreens/Dashbord";
import ProjectReachOut from "./components/Pages/ProjectReachOut";
import Feedback from "./components/Pages/Feedback";
import Teams from "./components/Pages/Teams";
import ProjectIssueAlert from "./components/Pages/ProjectIssueAlert";
import Publications from "./components/Pages/Publications";
import DocumentLibraryWorking from "./components/Pages/DocumentLibraryWorking";
import StartAnimation from "./components/Pages/StartAnimation";
import EmailVerification from "./components/auth/EmailVerification";
import ChangePassword from "./components/auth/ChangePassword";
import TicketSystem from "./components/Pages/TicketSystem";
import MeetingSchedule from "./components/Pages/MeetingSchedule";
import DasNav from "./components/navbars/DasNav";
import ProtectedRoute from "./ProtectedRoute";
import ProjectOverview from "./components/pages/ProjectOverview";
import FeedbackAttachmentsPage from "./components/Pages/FeedBackAttachmentsPage";
// Vendor Components
import VendorDashboard from "./vendor/VendorDashboard";
import PaymentTracking from "./vendor/PaymentTracking";
import VendorMeetingSchedule from "./vendor/VendorMeetingSchedule";
import VendorTicketingSystem from "./vendor/VendorTicketSystem";
import VendorFeedback from "./vendor/VendorFeedback";
import VendorPublications from "./vendor/VendorPublications";
import VendorNav from "./vendor/VendorNav";
 
 

import AdvisoryNav from "./Advisory/AdvisoryNav";
import AdvisoryDashboard from "./Advisory/AdvisoryDashboard";
import AdvisoryPaymentTracking from "./Advisory/AdvisoryPaymentTracking";
import AdvisoryBusinessLeads from "./Advisory/AdvisoryBusinessLeads"
import AdvisorySurveysList from "./Advisory/AdvisorySurveysList"
import AdvisoryJobPortal from "./Advisory/AdvisoryJobPortal"
import AdvisoryMeeting from "./Advisory/AdvisoryMeeting"
import AdvisoryDocument from "./Advisory/AdvisoryDocument"
 
import AlumniNav from "./Alumni/AlumniNav";
import AlumniDashboard from "./Alumni/AlumniDashboard"
import AlumniTeamSection from "./Alumni/AlumniTeamSection"
import Community from "./Alumni/Community"
import Event from "./Alumni/Event"
import JobPortal from "./Alumni/JobPortal"
import AlumniTicketSystem from "./Alumni/AlumniTicketSystem"
import AlumniSurveysList from "./Alumni/AlumniSurveysList"
import AlumniPublications from "./Alumni/AlumniPublications"
 
 
function App() {
  const [showAnimation, setShowAnimation] = useState(true);
 
  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 5000);
    return () => clearTimeout(timer);
  }, []);
 
  if (showAnimation) return <StartAnimation />;
 
  return (
    <Router>
      <Routes>
        {/* -------- Public Routes -------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/edit-login" element={<Editprologin />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />}>
          <Route path="verification" element={<EmailVerification />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
 
        {/* -------- Client Dashboard Routes -------- */}
        <Route path="/" element={<DasNav />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="details" element={<Dasone />} />
          <Route path="publications" element={<Publications />} />
          <Route path="reach-out" element={<ProtectedRoute><TicketSystem /></ProtectedRoute>} />
          <Route path="about" element={<Homepage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="edit-profile-login" element={<Editprologin />} />
          <Route path="project-reachout" element={<ProjectReachOut />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="know-your-team" element={<Teams />} />
          <Route path="project-issue-alert" element={<ProjectIssueAlert />} />
          <Route path="document-library" element={<DocumentLibraryWorking />} />
          <Route path="share-feedback" element={<Feedback />} />
          <Route path="meetings" element={<MeetingSchedule />} />
          <Route path="project-overview" element={<ProjectOverview />} />
          <Route path="project-attachments" element={<ProtectedRoute><FeedbackAttachmentsPage /></ProtectedRoute>} />
        </Route>
 
        {/* -------- Vendor Dashboard Routes -------- */}
        <Route path="/" element={<VendorNav />}>
          <Route path="vendor-dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
          <Route path="vendor-invoice" element={<ProtectedRoute><PaymentTracking /></ProtectedRoute>} />
          <Route path="vendor-meeting-schedule" element={<ProtectedRoute><VendorMeetingSchedule /></ProtectedRoute>} />
          <Route path="vendor-reach-out" element={<ProtectedRoute><VendorTicketingSystem/></ProtectedRoute>} />
          <Route path="vendor-share-feedback" element={<ProtectedRoute><VendorFeedback/></ProtectedRoute>} />
          <Route path="vendor-publications" element={<ProtectedRoute><VendorPublications/></ProtectedRoute>} />
        </Route>
 
        {/* -------- Advisory Dashboard Routes -------- */}
        <Route path="/" element={<AdvisoryNav />}>
          <Route path="advisory-dashboard" element={<ProtectedRoute><AdvisoryDashboard/></ProtectedRoute>} />
          <Route path="advisory-invoice" element={<ProtectedRoute><AdvisoryPaymentTracking/></ProtectedRoute>} />
          <Route path="advisory-business-leads" element={<ProtectedRoute><AdvisoryBusinessLeads/></ProtectedRoute>}/>
          <Route path="advisory-surveys" element={<ProtectedRoute><AdvisorySurveysList/></ProtectedRoute>}/>
          <Route path="advisory-job-portal" element={<ProtectedRoute><AdvisoryJobPortal/></ProtectedRoute>}/>
          <Route path="advisory-meeting-schedule" element={<ProtectedRoute><AdvisoryMeeting/></ProtectedRoute>}/>
          <Route path="advisory-documents" element={<ProtectedRoute><AdvisoryDocument/></ProtectedRoute>}/>  
        </Route>
 
        {/* -------- Alumni Dashboard Routes -------- */}
        <Route path="/" element={<AlumniNav />}>
          <Route path="alumni-home" element={<ProtectedRoute><AlumniDashboard/></ProtectedRoute>} />
          <Route path="teams" element={<ProtectedRoute><AlumniTeamSection/></ProtectedRoute>}/>
          <Route path="community" element={<ProtectedRoute><Community/></ProtectedRoute>}/>
          <Route path="event" element={<ProtectedRoute><Event/></ProtectedRoute>}/>
          <Route path="job-portal" element={<ProtectedRoute><JobPortal/></ProtectedRoute>}/>
          <Route path="help-desk" element={<ProtectedRoute><AlumniTicketSystem/></ProtectedRoute>} />
          <Route path="survey" element={<ProtectedRoute><AlumniSurveysList/></ProtectedRoute>}/>
          <Route path="news" element={<ProtectedRoute><AlumniPublications/></ProtectedRoute>}/>
        </Route>
 
        {/* -------- Catch-all Redirect -------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
 
export default App;
 
 