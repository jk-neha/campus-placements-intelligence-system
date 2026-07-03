import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardHome from './pages/DashboardHome'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

import StudentProfile from './pages/student/StudentProfile'
import ResumeUpload from './pages/student/ResumeUpload'
import Recommendations from './pages/student/Recommendations'
import EligibilityCheck from './pages/student/EligibilityCheck'

import AdminStudents from './pages/admin/AdminStudents'
import AdminCompanies from './pages/admin/AdminCompanies'

import CompanyManage from './pages/company/CompanyManage'
import CompanyEligibleStudents from './pages/company/CompanyEligibleStudents'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />

        {/* Student-only */}
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="resume"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="recommendations"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="eligibility"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <EligibilityCheck />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="companies"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCompanies />
            </ProtectedRoute>
          }
        />

        {/* Company-only */}
        <Route
          path="manage"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="eligible-students"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyEligibleStudents />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
