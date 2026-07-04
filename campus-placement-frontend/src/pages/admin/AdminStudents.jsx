import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import GlassCard from '../../components/GlassCard'
import Loader from '../../components/Loader'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/students'

const emptyForm = { name: '', cgpa: '', department: '', skills: '' }

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const data = await getStudents()
    setStudents(data)
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

  const openEdit = (student) => {
    setEditing(student)
    setForm({ name: student.name, cgpa: student.cgpa, department: student.department, skills: student.skills })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form, cgpa: parseFloat(form.cgpa) }
    try {
      if (editing) {
        await updateStudent(editing.id, payload)
      } else {
        await createStudent(payload)
      }
      setModalOpen(false)
      await load()
    }
    //  catch (err) {
    //   setError(err.response?.data?.detail || 'Could not save student')
    // } 
    catch(err){const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Validation Error")} 
      else {
        setError(detail || "Something went wrong")}}
    finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student record?')) return
    await deleteStudent(id)
    await load()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Students"
        subtitle="Full roster of student records in the system."
        // action={
        //   <button onClick={openCreate} className="btn-primary w-auto px-4 flex items-center gap-2">
        //     <Plus size={16} />
        //     Add student
        // //   </button>
        // }
        action={null}
      />

      {loading ? (
        <Loader label="Loading students" />
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
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-mist-100 font-medium">{s.name}</td>
                    <td className="px-5 py-3 text-mist-500">{s.department}</td>
                    <td className="px-5 py-3 font-mono text-mist-300">{s.cgpa}</td>
                    <td className="px-5 py-3 text-mist-500 max-w-xs truncate">{s.skills}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-white/10 text-mist-500 hover:text-mist-100">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md hover:bg-signal-coral/10 text-mist-500 hover:text-signal-coral">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-mist-500">
                      No students records Found
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
              {editing ? 'Edit student' : 'Add student'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="CGPA" type="number" step="0.01" value={form.cgpa} onChange={(v) => setForm({ ...form, cgpa: v })} />
              <Field label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
              <div>
                <label className="text-sm text-mist-300 mb-1.5 block">Skills</label>
                <textarea
                  rows={2}
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="Python, SQL, FastAPI"
                  className="input-field resize-none"
                  required
                />
              </div>
              {error && <p className="text-sm text-signal-coral">{error}</p>}
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add student'}
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
