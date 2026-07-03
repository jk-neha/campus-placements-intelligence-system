import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import MobileDrawer from '../components/MobileDrawer'
import { useAuth } from '../context/AuthContext'
import { navByRole } from '../components/navConfig'

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const items = navByRole[user?.role] || []

  return (
    <div className="min-h-screen flex bg-ink-900 bg-grid-glow">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar onToggleMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
        {menuOpen && <MobileDrawer items={items} onClose={() => setMenuOpen(false)} />}
        <main className="flex-1 px-4 py-6 md:px-10 md:py-10 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
