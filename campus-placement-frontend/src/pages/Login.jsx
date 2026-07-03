import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Radar, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-ink-900 bg-grid-glow overflow-hidden px-4">
      <div className="signature-rings">
        <svg width="640" height="640" viewBox="0 0 640 640" className="ring-rotate">
          <circle cx="320" cy="320" r="300" stroke="#6C5CE7" strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
          <circle cx="320" cy="320" r="230" stroke="#00D9C0" strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
          <circle cx="320" cy="320" r="160" stroke="#6C5CE7" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="4 10" fill="none" />
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
          <p className="label-eyebrow mb-2">Sign in</p>
          <h1 className="font-display font-semibold text-2xl text-mist-100 mb-6">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-mist-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-700" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-signal-coral bg-signal-coral/10 border border-signal-coral/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-sm text-mist-500 mt-6 text-center">
            New here?{' '}
            <Link to="/register" className="text-signal-violetSoft font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
