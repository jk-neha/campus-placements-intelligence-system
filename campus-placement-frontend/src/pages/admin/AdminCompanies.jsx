import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../api/companies'

const emptyForm = { company_name: '', minimum_cgpa: '', required_skills: '' }

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const data = await getCompanies()
    setCompanies(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (company) => {
    setEditing(company)
    setForm({
      company_name: company.company_name,
      minimum_cgpa: company.minimum_cgpa,
      required_skills: company.required_skills,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form, minimum_cgpa: parseFloat(form.minimum_cgpa) }
    try {
      if (editing) {
        await updateCompany(editing.id, payload)
      } else {
        await createCompany(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save company')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this company record?')) return
    await deleteCompany(id)
    await load()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Companies"
        subtitle="Hiring partners and their eligibility requirements."
        action={
          <button onClick={openCreate} className="btn-primary w-auto px-4 flex items-center gap-2">
            <Plus size={16} />
            Add company
          </button>
        }
      />

      {loading ? (
        <Loader label="Loading companies" />
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-mist-500 text-left">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Min. CGPA</th>
                  <th className="px-5 py-3 font-medium">Required skills</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-mist-100 font-medium">{c.company_name}</td>
                    <td className="px-5 py-3 font-mono text-mist-300">{c.minimum_cgpa}</td>
                    <td className="px-5 py-3 text-mist-500 max-w-xs truncate">{c.required_skills}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-white/10 text-mist-500 hover:text-mist-100">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-signal-coral/10 text-mist-500 hover:text-signal-coral">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-mist-500">
                      No companies yet. Add the first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <GlassCard strong className="w-full max-w-md relative fade-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-mist-500 hover:text-mist-100"
            >
              <X size={18} />
            </button>
            <h2 className="font-display font-semibold text-lg text-mist-100 mb-5">
              {editing ? 'Edit company' : 'Add company'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Company name" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} />
              <Field label="Minimum CGPA" type="number" step="0.01" value={form.minimum_cgpa} onChange={(v) => setForm({ ...form, minimum_cgpa: v })} />
              <div>
                <label className="text-sm text-mist-300 mb-1.5 block">Required skills</label>
                <textarea
                  rows={2}
                  value={form.required_skills}
                  onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                  placeholder="Python, SQL, FastAPI"
                  className="input-field resize-none"
                  required
                />
              </div>
              {error && <p className="text-sm text-signal-coral">{error}</p>}
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add company'}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

function Field({ label, onChange, ...props }) {
  return (
    <div>
      <label className="text-sm text-mist-300 mb-1.5 block">{label}</label>
      <input {...props} onChange={(e) => onChange(e.target.value)} className="input-field" required />
    </div>
  )
}
