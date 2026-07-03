import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
import { getCompanies } from '../../api/companies'
import { getStudents } from '../../api/students'

export default function CompanyEligibleStudents() {
  const [company, setCompany] = useState(null)
  const [eligible, setEligible] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [companies, students] = await Promise.all([getCompanies(), getStudents()])
      const mine = companies[0]
      setCompany(mine || null)
      if (mine) {
        const requiredSkills = mine.required_skills.split(',').map((s) => s.trim())
        const matches = students
          .map((s) => {
            const skills = s.skills.split(',').map((x) => x.trim())
            const missing = requiredSkills.filter((rs) => !skills.includes(rs))
            const eligible =
              parseFloat(s.cgpa) >= parseFloat(mine.minimum_cgpa) && missing.length === 0
            return { ...s, missing, eligible }
          })
          .filter((s) => s.eligible)
        setEligible(matches)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loader label="Matching students" />

  return (
    <div>
      <PageHeader
        eyebrow="Company"
        title="Eligible students"
        subtitle={company ? `Students who meet ${company.company_name}'s requirements.` : ''}
      />

      {!company ? (
        <GlassCard>
          <p className="text-mist-300 text-sm">Create a company listing first to see matches.</p>
        </GlassCard>
      ) : eligible.length === 0 ? (
        <GlassCard>
          <p className="text-mist-300 text-sm">No students currently meet your requirements.</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-mist-500 text-left">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">CGPA</th>
                  <th className="px-5 py-3 font-medium">Skills</th>
                </tr>
              </thead>
              <tbody>
                {eligible.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-mist-100 font-medium">{s.name}</td>
                    <td className="px-5 py-3 text-mist-500">{s.department}</td>
                    <td className="px-5 py-3 font-mono text-signal-teal">{s.cgpa}</td>
                    <td className="px-5 py-3 text-mist-500 max-w-xs truncate">{s.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
