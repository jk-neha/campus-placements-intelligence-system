import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentJobs from "./pages/student/Jobs";
import StudentApplications from "./pages/student/Applications";
import StudentRecommendations from "./pages/student/Recommendations";
import StudentEligibility from "./pages/student/Eligibility";
import PlacementAnalysis from "./pages/student/PlacementAnalysis";

import CompanyDashboard from "./pages/company/Dashboard";
import CompanyProfile from "./pages/company/Profile";
import CompanyJobs from "./pages/company/Jobs";
import CompanyApplications from "./pages/company/Applications";
import CompanyEligibleStudents from "./pages/company/EligibleStudents";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminCompanies from "./pages/admin/Companies";
import AdminCreate from "./pages/admin/CreateRecord";

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Landing />;
  return <Navigate to={`/${user.role}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute roles={["student"]}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="jobs" element={<StudentJobs />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="recommendations" element={<StudentRecommendations />} />
            <Route path="eligibility" element={<StudentEligibility />} />
            <Route path="placement-analysis" element={<PlacementAnalysis />} />
          </Route>

          <Route
            path="/company"
            element={
              <ProtectedRoute roles={["company"]}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyDashboard />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="jobs" element={<CompanyJobs />} />
            <Route path="applications" element={<CompanyApplications />} />
            <Route path="eligible-students" element={<CompanyEligibleStudents />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="create" element={<AdminCreate />} />
          </Route>

          

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
