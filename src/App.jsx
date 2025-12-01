// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "animate.css";

import StartAnimation from "./components/LandingPage/StartAnimation";
import Homepage from "./components/LandingPage/Homepage";
import Login from "./auth/Login";
import Editprologin from "./Client/Editprologin";
import EmailVerification from "./auth/EmailVerification";
import ChangePassword from "./auth/ChangePassword";

// Importing ProtectedRoute to secure private routes
import ProtectedRoute from "./ProtectedRoute";
 
// Client Components
import Dashboard from "./Client/Dashbord";
import Feedback from "./Client/Feedback";
import Teams from "./Client/Teams";
import Resarch from "./Client/Research"
import Publications from "./Client/Publications";
import DocumentLibraryWorking from "./Client/DocumentLibraryWorking";
import TicketSystem from "./Client/TicketSystem";
import MeetingSchedule from "./Client/MeetingSchedule";
// client navabr
import DasNav from "./Client/DasNav";  
import ProjectOverview from "./Client/ProjectOverview";


// Vendor Components
import VendorDashboard from "./vendor/VendorDashboard";
import PaymentTracking from "./vendor/PaymentTracking";
import VendorMeetingSchedule from "./vendor/VendorMeetingSchedule";
import VendorTicketingSystem from "./vendor/VendorTicketSystem";
import VendorFeedback from "./vendor/VendorFeedback";
import VendorPublications from "./vendor/VendorPublications";
import VendorNav from "./vendor/VendorNav";
import TravelVendorDashboard from "./vendor/TravelVendorDashboard";

// Advisory Components
import AdvisoryNav from "./Advisory/AdvisoryNav";
import AdvisoryDashboard from "./Advisory/AdvisoryDashboard";
import AdvisoryPaymentTracking from "./Advisory/AdvisoryPaymentTracking";
import AdvisoryBusinessLeads from "./Advisory/AdvisoryBusinessLeads"
import AdvisorySurveysList from "./Advisory/AdvisorySurveysList"
import AdvisoryJobPortal from "./Advisory/AdvisoryJobPortal"
import AdvisoryMeeting from "./Advisory/AdvisoryMeeting"
import AdvisoryDocument from "./Advisory/AdvisoryDocument"
 
// Alumni Components
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

  const vendorType = localStorage.getItem("vendorType");
 
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
          <Route path="publications" element={<Publications />} />
          <Route path="research" element={<Resarch />} />
          <Route path="reach-out" element={<ProtectedRoute><TicketSystem /></ProtectedRoute>} />
          <Route path="know-your-team" element={<Teams />} />
          <Route path="document-library" element={<DocumentLibraryWorking />} />
          <Route path="share-feedback" element={<Feedback />} />
          <Route path="meetings" element={<MeetingSchedule />} />
          <Route path="project-overview" element={<ProjectOverview />} />
        </Route>
 
        {/* -------- Vendor Dashboard Routes -------- */}
      <Route path="/" element={<VendorNav />}>
          {/* <Route path="vendor-dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} /> */}

          {/* If vendor is TRAVEL type */}
          {vendorType === "TRAVEL" ? (
            <>
              <Route
                path="vendor-travel-dashboard"
                element={
                  <ProtectedRoute>
                    <TravelVendorDashboard />
                  </ProtectedRoute>
                }
              />
        
              {/* Travel vendors should NOT see invoices or other vendor pages */}
              {/* BLOCK SNIP — do not include vendor-invoice, vendor-meeting, vendor-reach-out, etc */}
            </>
          ) : (
            <>
              {/* Normal vendor */}
              <Route
                path="vendor-dashboard"
                element={
                  <ProtectedRoute>
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />
              </>
            )}
        
            {vendorType !== "TRAVEL" && (
              <Route
                path="vendor-invoice"
                element={
                  <ProtectedRoute>
                    <PaymentTracking />
                  </ProtectedRoute>
                }
              />
            )}

            {/* <Route path="vendor-invoice" element={<ProtectedRoute><PaymentTracking /></ProtectedRoute>} /> */}
            <Route path="vendor-meeting-schedule" element={<ProtectedRoute><VendorMeetingSchedule /></ProtectedRoute>} />
            <Route path="vendor-reach-out" element={<ProtectedRoute><VendorTicketingSystem/></ProtectedRoute>} />
            <Route path="vendor-share-feedback" element={<ProtectedRoute><VendorFeedback/></ProtectedRoute>} />
            <Route path="vendor-publications" element={<ProtectedRoute><VendorPublications/></ProtectedRoute>} />
            {/* <Route path="vendor-travel-dashboard" element={<ProtectedRoute><TravelVendorDashboard/></ProtectedRoute>} /> */}    
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
 
 