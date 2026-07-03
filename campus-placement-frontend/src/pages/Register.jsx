import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Radar, Mail, Lock, User, ArrowRight, GraduationCap, Building2, ShieldCheck } from 'lucide-react'
import { registerRequest } from '../api/auth'

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
  { value: 'company', label: 'Company', icon: Building2 },
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ user_name: '', user_mail: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await registerRequest(form)
      if (res.msg === 'Email already exists') {
        setError('An account with this email already exists')
        return
      }
      setSuccess('Account created. Redirecting to sign in…')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-ink-900 bg-grid-glow overflow-hidden px-4 py-10">
      <div className="signature-rings">
        <svg width="640" height="640" viewBox="0 0 640 640" className="ring-rotate">
          <circle cx="320" cy="320" r="300" stroke="#00D9C0" strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
          <circle cx="320" cy="320" r="230" stroke="#6C5CE7" strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
          <circle cx="320" cy="320" r="160" stroke="#00D9C0" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="4 10" fill="none" />
        </svg>
      </div>

      <div className="relative w-full max-w-md fade-up">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-signal-violet to-signal-teal flex items-center justify-center">
            <Radar size={18} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-mist-100">
            Placement Intelligence
          </span>
        </div>

        <div className="glass-panel-strong p-8">
          <p className="label-eyebrow mb-2">Get started</p>
          <h1 className="font-display font-semibold text-2xl text-mist-100 mb-6">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-mist-300 mb-1.5 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-700" />
                <input
                  type="text"
                  name="user_name"
                  required
                  value={form.user_name}
                  onChange={handleChange}
                  placeholder="jordan_k"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-mist-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-700" />
                <input
                  type="email"
                  name="user_mail"
                  required
                  value={form.user_mail}
                  onChange={handleChange}
                  placeholder="you@campus.edu"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-mist-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-700" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-mist-300 mb-2 block">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, icon: Icon }) => {
                  const active = form.role === value
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setForm({ ...form, role: value })}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-xs font-medium transition-all ${
                        active
                          ? 'bg-signal-violet/15 border-signal-violet/50 text-mist-100'
                          : 'bg-white/5 border-white/10 text-mist-500 hover:text-mist-100'
                      }`}
                    >
                      <Icon size={17} />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <p className="text-sm text-signal-coral bg-signal-coral/10 border border-signal-coral/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-signal-teal bg-signal-teal/10 border border-signal-teal/20 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-sm text-mist-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-signal-violetSoft font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
