import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import About from "./pages/Home/About";
import StudentProtectedRoute from "./pages/Student/StudentProtectedRoute";
import CompanyProtectedRoute from './pages/Company/CompanyProtectedRoute';
// import AdminProtectedRoute from './pages/Admin/AdminProtectedRoute';

import StudentPanel from "./pages/Student/StudentPanel";
import StudentLogin from "./pages/Student/StudentLogin";
import StudentRegister from "./pages/Student/StudentRegister";
import CompanyLogin from "./pages/Company/CompanyLogin";
import CompanyRegister from "./pages/Company/CompanyRegister";

import StudentJob from "./pages/Student/StudentJob";
import StudentApplyJob from "./pages/Student/StudentApplyJob";
import StudentApplicationTrack from "./pages/Student/StudentApplicationTrack";

import CompanyHome from "./pages/Company/CompanyHome";
import CompanyPostJob from "./pages/Company/CompanyPostJob";
import CompanyGetJobs from "./pages/Company/CompanyGetJobs";
import CompanyJobRouter from "./pages/Company/CompanyJobRouter";
import CompanyResumeShortlist from "./pages/Company/CompanyResumeShortlist";
import CompanySendCondingTest from "./pages/Company/CompanySendCondingTest";
import CompanyEvaluateCodingTest from "./pages/Company/CompanyEvaluateCodingTest";
import CompanyScheduleInterview from "./pages/Company/CompanyScheduleInterview";
import CompanyEvaluateInterview from "./pages/Company/CompanyEvaluateInterview";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/student"
          element={
            <StudentProtectedRoute>
              <StudentPanel />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/company"
          element={
            <CompanyProtectedRoute>
              <CompanyHome />
            </CompanyProtectedRoute>
          }
        />


        {/* <Route path = "/student/logout" element = {
          <StudentProtectedRoute>
            <Logout />
          </StudentProtectedRoute>
        } /> */}
        {/* <Route path = "/company/logout" element = { 
          <CompanyProtectedRoute>
            <Logout />
          </CompanyProtectedRoute>
        } /> */}

        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/company-register" element={<CompanyRegister />} />

        <Route
          path="/student/jobs"
          element={
            <StudentProtectedRoute>
              <StudentPanel>
                <StudentJob />
              </StudentPanel>
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/apply-job/:jobId"
          element={
            <StudentProtectedRoute>
              <StudentApplyJob />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/application-track/:jobId"
          element={
            <StudentProtectedRoute>
              <StudentApplicationTrack />
            </StudentProtectedRoute>
          }
        />

        <Route 
          path="/company/home/"
          element={
            <CompanyProtectedRoute>
              <CompanyHome />
            </CompanyProtectedRoute>
          }
        />

        <Route 
          path="/company/post-job"
          element={
            <CompanyProtectedRoute>
              <CompanyPostJob />
            </CompanyProtectedRoute>
          }
        />

        <Route
          path="/company/get-jobs"
          element={
            <CompanyProtectedRoute>
              <CompanyGetJobs />
            </CompanyProtectedRoute>
          }
        />

        <Route 
          path="/company/job/:jobId"
          element={
            <CompanyProtectedRoute>
              <CompanyJobRouter />
            </CompanyProtectedRoute>
          }
        />

        <Route
          path="/company/job/resume/:jobId"
          element={
            <CompanyProtectedRoute>
              <CompanyResumeShortlist />
            </CompanyProtectedRoute>
          }
        />

        <Route
          path="/company/job/send-coding-test/:jobId"
          element={
            <CompanyProtectedRoute>
              <CompanySendCondingTest />
            </CompanyProtectedRoute>
          }
        />

        <Route
          path="/company/job/:jobId/evaluate-coding-test"
          element={
            <CompanyProtectedRoute>
              <CompanyEvaluateCodingTest />
            </CompanyProtectedRoute>
          }
        />

        <Route
          path="/company/job/:jobId/schedule-interview"
          element={
            <CompanyProtectedRoute>
              <CompanyScheduleInterview />
            </CompanyProtectedRoute>
          }
        />

        <Route
          path="/company/job/:jobId/evaluate-interview"
          element={
            <CompanyProtectedRoute>
              <CompanyEvaluateInterview />
            </CompanyProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
