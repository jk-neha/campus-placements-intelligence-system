import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
// import { getCompanies, createCompany, updateCompany } from '../../api/companies'
import { createCompany, updateCompany } from '../../api/companies'
import { getMyCompany } from '../../api/profile'

const emptyForm = { company_name: '', minimum_cgpa: '', required_skills: '' }

export default function CompanyManage() {
  const [existing, setExisting] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      // const companies = await getCompanies()
      // const mine = companies[0]
      const mine = await getMyCompany()
      if (mine) {
        setExisting(mine)
        setForm({
          company_name: mine.company_name,
          minimum_cgpa: mine.minimum_cgpa,
          required_skills: mine.required_skills,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    // const payload = { ...form, minimum_cgpa: parseFloat(form.minimum_cgpa) }
    const payload = {
  ...form,
  minimum_cgpa: parseFloat(form.minimum_cgpa)
}

console.log("PAYLOAD SENT:", payload)
    try {
      if (existing) {
        const updated = await updateCompany(existing.id, payload)
        setExisting(updated)
        setMessage('Listing updated')
      } else {
        const created = await createCompany(payload)
        setExisting(created)
        setMessage('Listing created')
      }
    } 
    // catch (err) {
    //   setError(err.response?.data?.detail || 'Could not save listing')
    // } 
    catch (err) {
    console.log(err.response?.data)

    const detail = err.response?.data?.detail

    if (Array.isArray(detail)) {
    setError(detail[0]?.msg || "Validation Error")
  } else {
    setError(detail || "Something went wrong")
  }
}
    finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading listing" />

  return (
    <div>
      <PageHeader
        eyebrow="Company"
        title={existing ? 'Update listing' : 'Create your listing'}
        subtitle="Set the CGPA cutoff and skills required for this role."
      />

      <GlassCard strong className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-mist-300 mb-1.5 block">Company name</label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-sm text-mist-300 mb-1.5 block">Minimum CGPA</label>
            <input
              type="number"
              step="0.01"
              name="minimum_cgpa"
              value={form.minimum_cgpa}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-sm text-mist-300 mb-1.5 block">Required skills</label>
            <textarea
              name="required_skills"
              rows={3}
              value={form.required_skills}
              onChange={handleChange}
              placeholder="Python, SQL, FastAPI"
              className="input-field resize-none"
              required
            />
            <p className="text-xs text-mist-700 mt-1">Comma-separated, matches student skill matching.</p>
          </div>

          {message && <p className="text-sm text-signal-teal">{message}</p>}
          {error && <p className="text-sm text-signal-coral">{error}</p>}

          <button type="submit" disabled={saving} className="btn-primary w-auto px-6">
            {saving ? 'Saving…' : existing ? 'Save changes' : 'Create listing'}
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
