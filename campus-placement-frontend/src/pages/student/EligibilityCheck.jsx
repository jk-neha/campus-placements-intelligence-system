import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import ReadinessGauge from '../../components/ReadinessGauge'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
// import { getStudents, checkEligibility } from '../../api/students'
import { checkEligibility } from '../../api/students'
import { getMyStudent } from '../../api/profile'
import { getCompanies } from '../../api/companies'

export default function EligibilityCheck() {
  const { user } = useAuth()
  const [studentId, setStudentId] = useState(null)
  const [companies, setCompanies] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      // const [students, comps] = await Promise.all([getStudents(), getCompanies()])
      // const mine = students.find((s) => s.user_id === user.id)
      // setStudentId(mine?.id || null)
      const [mine, comps] = await Promise.all([
  getMyStudent(),
  getCompanies()
])

      setStudentId(mine?.id || null)
      setCompanies(comps)
      setLoading(false)
    }
    load()
  }, [user])

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!companyId || !studentId) return
    setChecking(true)
    setError('')
    setResult(null)
    try {
      const data = await checkEligibility(studentId, companyId)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not run eligibility check')
    } finally {
      setChecking(false)
    }
  }

  if (loading) return <Loader label="Loading companies" />

  return (
    <div>
      <PageHeader
        eyebrow="Student"
        title="Eligibility check"
        subtitle="Pick a company to see exactly where you stand."
      />

      <GlassCard strong className="max-w-xl mb-6">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="input-field flex-1"
            required
          >
            <option value="">Select a company…</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={checking || !studentId} className="btn-primary sm:w-40">
            {checking ? 'Checking…' : 'Check'}
          </button>
        </form>
        {!studentId && (
          <p className="text-xs text-mist-500 mt-3">No student record linked to your account yet.</p>
        )}
        {error && <p className="text-sm text-signal-coral mt-3">{error}</p>}
      </GlassCard>

      {result && (
        <GlassCard className="max-w-xl fade-up flex items-center gap-6">
          <ReadinessGauge score={result.readiness_score} size={100} strokeWidth={8} />
          <div className="flex-1">
            <p className="text-mist-100 font-medium text-lg">{result.company}</p>
            <p className="text-sm text-mist-500 mt-1">
              Requires CGPA {result.company_required_cgpa} · You have {result.student_cgpa}
            </p>
            <p
              className={`text-sm font-medium mt-2 ${
                result.eligible ? 'text-signal-teal' : 'text-signal-coral'
              }`}
            >
              {result.eligible ? 'You meet the CGPA cutoff' : 'Below the CGPA cutoff'}
            </p>
            {result.missing_skills.length > 0 && (
              <p className="text-xs text-mist-500 mt-2">
                Missing skills: {result.missing_skills.join(', ')}
              </p>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
