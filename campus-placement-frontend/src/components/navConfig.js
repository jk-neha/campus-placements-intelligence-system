import { LayoutGrid, UserRound, Building2, FileUp, Sparkles, ShieldCheck } from 'lucide-react'

export const navByRole = {
  student: [
    { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
    { to: '/dashboard/resume', label: 'Resume', icon: FileUp },
    { to: '/dashboard/recommendations', label: 'Recommendations', icon: Sparkles },
    { to: '/dashboard/eligibility', label: 'Eligibility', icon: ShieldCheck },
  ],
  admin: [
    { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/dashboard/students', label: 'Students', icon: UserRound },
    { to: '/dashboard/companies', label: 'Companies', icon: Building2 },
  ],
  company: [
    { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/dashboard/manage', label: 'Company profile', icon: Building2 },
    { to: '/dashboard/eligible-students', label: 'Eligible students', icon: UserRound },
  ],
}
