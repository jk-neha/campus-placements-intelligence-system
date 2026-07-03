import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserRound, Building2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
import { getStudents } from '../../api/students'
import { getCompanies } from '../../api/companies'

export default function AdminOverview() {
  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [s, c] = await Promise.all([getStudents(), getCompanies()])
      setStudents(s)
      setCompanies(c)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loader label="Loading records" />

  const avgCgpa = students.length
    ? (students.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / students.length).toFixed(2)
    : '—'

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Placement overview" subtitle="Everything moving through the system, at a glance." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Students" value={students.length} accent="violet" />
        <StatCard label="Companies" value={companies.length} accent="teal" />
        <StatCard label="Average CGPA" value={avgCgpa} accent="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/dashboard/students">
          <GlassCard className="hover:border-signal-violet/40 transition-colors h-full">
            <div className="w-9 h-9 rounded-lg bg-signal-violet/15 flex items-center justify-center mb-3">
              <UserRound size={17} className="text-signal-violetSoft" />
            </div>
            <p className="text-mist-100 font-medium text-sm">Manage students</p>
            <p className="text-mist-500 text-xs mt-1">Add, edit, or remove student records</p>
          </GlassCard>
        </Link>
        <Link to="/dashboard/companies">
          <GlassCard className="hover:border-signal-teal/40 transition-colors h-full">
            <div className="w-9 h-9 rounded-lg bg-signal-teal/15 flex items-center justify-center mb-3">
              <Building2 size={17} className="text-signal-teal" />
            </div>
            <p className="text-mist-100 font-medium text-sm">Manage companies</p>
            <p className="text-mist-500 text-xs mt-1">Set CGPA cutoffs and required skills</p>
          </GlassCard>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  const colors = {
    violet: 'text-signal-violetSoft',
    teal: 'text-signal-teal',
    amber: 'text-signal-amber',
  }
  return (
    <GlassCard>
      <p className="label-eyebrow mb-3">{label}</p>
      <p className={`text-3xl font-mono font-semibold ${colors[accent]}`}>{value}</p>
    </GlassCard>
  )
}
