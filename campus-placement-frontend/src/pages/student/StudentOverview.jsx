import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, FileUp, UserRound } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import ReadinessGauge from '../../components/ReadinessGauge'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
// import { getStudents, getEligibilityReadiness } from '../../api/students'
import { getEligibilityReadiness } from '../../api/students'
import { getMyStudent } from '../../api/profile'

export default function StudentOverview() {
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [readiness, setReadiness] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
  try {
    const mine = await getMyStudent()
    console.log("Found Student:", mine)
    setStudent(mine)

    if (mine) {
      const data = await getEligibilityReadiness(mine.id)
      setReadiness(data)
    }
  } catch (err) {
    console.error(err)
    setStudent(null)
  } finally {
    setLoading(false)
  }
}
    load()
  }, [user])

  if (loading) return <Loader label="Loading your dashboard" />

  const avgReadiness =
    readiness.length > 0
      ? readiness.reduce((sum, r) => sum + r.readiness_score, 0) / readiness.length
      : 0
  const eligibleCount = readiness.filter((r) => r.eligible).length

  return (
    <div>
      <PageHeader
        eyebrow="Student"
        title={`Hey, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Here's how you're tracking against companies hiring on campus."
      />

      {!student ? (
        <GlassCard>
          <p className="text-mist-300 text-sm">
            No student profile found yet. Ask your placement admin to add your record, or check
            back once your profile is created.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassCard strong className="flex items-center gap-5">
              <ReadinessGauge score={avgReadiness} label="Avg. readiness" />
              <div>
                <p className="text-3xl font-display font-semibold text-mist-100">
                  {Math.round(avgReadiness)}%
                </p>
                <p className="text-sm text-mist-500 mt-1">Across {readiness.length} companies</p>
              </div>
            </GlassCard>

            <GlassCard>
              <p className="label-eyebrow mb-3">CGPA</p>
              <p className="text-3xl font-mono font-semibold text-mist-100">{student.cgpa}</p>
              <p className="text-sm text-mist-500 mt-1">{student.department}</p>
            </GlassCard>

            <GlassCard>
              <p className="label-eyebrow mb-3">Eligible companies</p>
              <p className="text-3xl font-mono font-semibold text-signal-teal">{eligibleCount}</p>
              <p className="text-sm text-mist-500 mt-1">of {readiness.length} tracked</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickLink to="/dashboard/profile" icon={UserRound} title="View profile" desc="Skills, CGPA, department" />
            <QuickLink to="/dashboard/resume" icon={FileUp} title="Upload resume" desc="Auto-extract your skills" />
            <QuickLink to="/dashboard/recommendations" icon={Sparkles} title="Recommendations" desc="Companies you qualify for" />
          </div>
        </>
      )}
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to}>
      <GlassCard className="hover:border-signal-violet/40 transition-colors h-full">
        <div className="w-9 h-9 rounded-lg bg-signal-violet/15 flex items-center justify-center mb-3">
          <Icon size={17} className="text-signal-violetSoft" />
        </div>
        <p className="text-mist-100 font-medium text-sm">{title}</p>
        <p className="text-mist-500 text-xs mt-1">{desc}</p>
      </GlassCard>
    </Link>
  )
}
