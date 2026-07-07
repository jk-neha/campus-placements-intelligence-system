import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = {
  student: [
    { to: "/student", label: "Overview", icon: "◆", end: true },
    { to: "/student/profile", label: "My Record", icon: "▤" },
    { to: "/student/jobs", label: "Job Board", icon: "⚑" },
    { to: "/student/applications", label: "My Applications", icon: "▦" },
    { to: "/student/recommendations", label: "Recommendations", icon: "◎" },
    { to: "/student/eligibility", label: "Eligibility Check", icon: "✓" },
    {to:"/student/placement-analysis", label:"Placement Analysis", icon:"✦"}
  ],
  company: [
    { to: "/company", label: "Overview", icon: "◆", end: true },
    { to: "/company/profile", label: "Company Record", icon: "▤" },
    { to: "/company/jobs", label: "Postings", icon: "⚑" },
    { to: "/company/applications", label: "Applications", icon: "▦" },
    { to: "/company/eligible-students", label: "Eligible Students", icon: "◎" },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: "◆", end: true },
    { to: "/admin/students", label: "Students", icon: "▤" },
    { to: "/admin/companies", label: "Companies", icon: "🏛" },
    { to: "/admin/create", label: "Add Record", icon: "＋" },
  ],
};

const TITLES = {
  student: "Student Registrar",
  company: "Recruiter Console",
  admin: "Administration",
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = NAV[user?.role] || [];
  const initials = (user?.name || "?").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div>
          <div className="brand">
            Registrar<span className="brand-mark">.</span>
          </div>
          <div className="brand-sub">Campus Placements</div>

          <div className="nav-group-label">{TITLES[user?.role] || "Menu"}</div>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-foot">
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="main-col">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
              ☰
            </button>
            <div>
              <div className="eyebrow">{user?.role}</div>
              <h1>{TITLES[user?.role] || "Dashboard"}</h1>
            </div>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
