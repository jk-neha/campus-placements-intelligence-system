import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import ReadinessGauge from '../../components/ReadinessGauge'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
// import { getStudents, getEligibilityReadiness } from '../../api/students'
import { getEligibilityReadiness } from '../../api/students'
import { getMyStudent } from '../../api/profile'

const statusStyles = {
  'Placement Ready': 'text-signal-teal bg-signal-teal/10 border-signal-teal/25',
  Average: 'text-signal-amber bg-signal-amber/10 border-signal-amber/25',
  'Needs Improvement': 'text-signal-coral bg-signal-coral/10 border-signal-coral/25',
}

export default function Recommendations() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // const students = await getStudents()
      // const mine = students.find((s) => s.user_id === user.id)
      const mine = await getMyStudent()
      if (mine) {
        const data = await getEligibilityReadiness(mine.id)
        setRows(data.sort((a, b) => b.readiness_score - a.readiness_score))
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) return <Loader label="Matching you to companies" />

  return (
    <div>
      <PageHeader
        eyebrow="Student"
        title="Recommendations"
        subtitle="Ranked by how ready you are for each company's requirements."
      />

      {rows.length === 0 ? (
        <GlassCard>
          <p className="text-mist-300 text-sm">No companies to compare against yet.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map((row) => (
            <GlassCard key={row.company} className="flex items-center gap-5">
              <ReadinessGauge score={row.readiness_score} size={72} strokeWidth={6} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-mist-100 font-medium truncate">{row.company}</p>
                  {row.eligible && (
                    <span className="text-[10px] uppercase tracking-wide font-mono text-signal-teal shrink-0">
                      Eligible
                    </span>
                  )}
                </div>
                <span
                  className={`inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full border ${statusStyles[row.status]}`}
                >
                  {row.status}
                </span>
                {row.missing_skills.length > 0 && (
                  <p className="text-xs text-mist-500 mt-2 truncate">
                    Missing: {row.missing_skills.join(', ')}
                  </p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
