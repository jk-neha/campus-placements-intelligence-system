import { NavLink } from 'react-router-dom'
import { LogOut, Radar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { navByRole } from './navConfig'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const items = navByRole[user?.role] || []

  return (
    <aside className="hidden md:flex md:w-64 flex-col shrink-0 h-screen sticky top-0 border-r border-white/5 bg-ink-950/60 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-signal-violet to-signal-teal flex items-center justify-center">
          <Radar size={16} className="text-white" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm leading-tight text-mist-100">
            Placement
          </p>
          <p className="text-[11px] text-mist-500 leading-tight">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-signal-violet/15 text-mist-100 border border-signal-violet/30'
                  : 'text-mist-500 hover:text-mist-100 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 pt-4 mt-4">
        <div className="px-2 mb-3">
          <p className="text-sm text-mist-100 font-medium truncate">{user?.name}</p>
          <p className="text-[11px] text-mist-500 uppercase tracking-wide font-mono">
            {user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-mist-500 hover:text-signal-coral hover:bg-signal-coral/10 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
