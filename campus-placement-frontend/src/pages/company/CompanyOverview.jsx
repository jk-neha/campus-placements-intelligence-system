import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, UserRound } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
// import { getCompanies } from '../../api/companies'
import { getCompanies } from '../../api/companies'
import { getMyCompany } from '../../api/profile'
import { getStudents } from '../../api/students'

export default function CompanyOverview() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [eligibleCount, setEligibleCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // const [comps, students] = await Promise.all([getCompanies(), getStudents()])
      // setCompanies(comps)
      // const mine = comps[0]
      const [mine, students] = await Promise.all([
  getMyCompany(),
  getStudents()
])

      setCompanies([mine])
      if (mine) {
        const requiredSkills = mine.required_skills.split(',').map((s) => s.trim())
        const count = students.filter((s) => {
          const skills = s.skills.split(',').map((x) => x.trim())
          const meetsAllSkills = requiredSkills.every((rs) => skills.includes(rs))
          return parseFloat(s.cgpa) >= parseFloat(mine.minimum_cgpa) && meetsAllSkills
        }).length
        setEligibleCount(count)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loader label="Loading company data" />

  const mine = companies[0]

  return (
    <div>
      <PageHeader eyebrow="Company" title={`Hi, ${user?.name}`} subtitle="Track your listing and see who qualifies." />

      {!mine ? (
        <GlassCard>
          <p className="text-mist-300 text-sm mb-4">
            You haven't set up a company listing yet. Create one to start finding eligible
            students.
          </p>
          <Link to="/dashboard/manage" className="btn-primary w-auto px-5 inline-flex">
            Set up company
          </Link>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <GlassCard>
              <p className="label-eyebrow mb-3">Listing</p>
              <p className="text-xl font-display font-semibold text-mist-100">{mine.company_name}</p>
            </GlassCard>
            <GlassCard>
              <p className="label-eyebrow mb-3">Min. CGPA</p>
              <p className="text-3xl font-mono font-semibold text-mist-100">{mine.minimum_cgpa}</p>
            </GlassCard>
            <GlassCard>
              <p className="label-eyebrow mb-3">Eligible students</p>
              <p className="text-3xl font-mono font-semibold text-signal-teal">{eligibleCount}</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/dashboard/manage">
              <GlassCard className="hover:border-signal-violet/40 transition-colors h-full">
                <div className="w-9 h-9 rounded-lg bg-signal-violet/15 flex items-center justify-center mb-3">
                  <Building2 size={17} className="text-signal-violetSoft" />
                </div>
                <p className="text-mist-100 font-medium text-sm">Update listing</p>
                <p className="text-mist-500 text-xs mt-1">CGPA cutoff and required skills</p>
              </GlassCard>
            </Link>
            <Link to="/dashboard/eligible-students">
              <GlassCard className="hover:border-signal-teal/40 transition-colors h-full">
                <div className="w-9 h-9 rounded-lg bg-signal-teal/15 flex items-center justify-center mb-3">
                  <UserRound size={17} className="text-signal-teal" />
                </div>
                <p className="text-mist-100 font-medium text-sm">View eligible students</p>
                <p className="text-mist-500 text-xs mt-1">Who currently qualifies</p>
              </GlassCard>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
