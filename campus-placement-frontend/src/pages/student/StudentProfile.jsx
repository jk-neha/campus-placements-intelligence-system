import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
// import { getStudents, updateStudent } from '../../api/students'
import { updateStudent } from '../../api/students'
import { getMyStudent } from '../../api/profile'


export default function StudentProfile() {
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      // const students = await getStudents()
      // const mine = students.find((s) => s.user_id === user.id)
      const mine = await getMyStudent()
      setStudent(mine || null)
      if (mine) setForm(mine)
      setLoading(false)
    }
    load()
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const updated = await updateStudent(student.id, {
        name: form.name,
        cgpa: parseFloat(form.cgpa),
        department: form.department,
        skills: form.skills,
      })
      setStudent(updated)
      setMessage('Profile updated')
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading profile" />
  if (!student)
    return (
      <div>
        <PageHeader eyebrow="Student" title="Profile" />
        <GlassCard>
          <p className="text-mist-300 text-sm">No student record linked to your account yet.</p>
        </GlassCard>
      </div>
    )

  return (
    <div>
      <PageHeader eyebrow="Student" title="Your profile" subtitle="Keep this current — it drives your recommendations." />
      <GlassCard strong className="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Full name" name="name" value={form.name} onChange={handleChange} />
          <Field label="CGPA" name="cgpa" type="number" step="0.01" value={form.cgpa} onChange={handleChange} />
          <Field label="Department" name="department" value={form.department} onChange={handleChange} />
          <div>
            <label className="text-sm text-mist-300 mb-1.5 block">Skills</label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              rows={3}
              placeholder="Python, SQL, FastAPI"
              className="input-field resize-none"
            />
            <p className="text-xs text-mist-700 mt-1">Comma-separated, matches recommendation matching.</p>
          </div>

          {message && <p className="text-sm text-signal-teal">{message}</p>}

          <button type="submit" disabled={saving} className="btn-primary w-auto px-6">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </GlassCard>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-mist-300 mb-1.5 block">{label}</label>
      <input {...props} className="input-field" required />
    </div>
  )
}
