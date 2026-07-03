import { useAuth } from '../context/AuthContext'
import StudentOverview from './student/StudentOverview'
import AdminOverview from './admin/AdminOverview'
import CompanyOverview from './company/CompanyOverview'

export default function DashboardHome() {
  const { user } = useAuth()

  if (user?.role === 'student') return <StudentOverview />
  if (user?.role === 'admin') return <AdminOverview />
  if (user?.role === 'company') return <CompanyOverview />
  return null
}
