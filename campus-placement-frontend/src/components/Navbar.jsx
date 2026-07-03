import { Menu, X, Radar } from 'lucide-react'

export default function Navbar({ onToggleMenu, menuOpen }) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-ink-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-signal-violet to-signal-teal flex items-center justify-center">
          <Radar size={14} className="text-white" />
        </div>
        <span className="font-display font-semibold text-sm text-mist-100">Placement</span>
      </div>
      <button
        onClick={onToggleMenu}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="p-2 rounded-lg border border-white/10 text-mist-100"
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  )
}
