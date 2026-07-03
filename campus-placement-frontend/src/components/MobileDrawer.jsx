import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function MobileDrawer({ items, onClose }) {
  const { user, logout } = useAuth()

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl px-5 py-6 fade-up">
      <div className="mb-6">
        <p className="text-sm text-mist-100 font-medium">{user?.name}</p>
        <p className="text-[11px] text-mist-500 uppercase tracking-wide font-mono">
          {user?.role}
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                isActive ? 'bg-signal-violet/15 text-mist-100' : 'text-mist-500'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => {
          onClose()
          logout()
        }}
        className="mt-6 w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-signal-coral border border-signal-coral/20"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  )
}
