import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  PackageSearch,
  ClipboardCheck,
  Users,
  Tags,
  BarChart3,
  Activity,
  Bell,
} from 'lucide-react'
import { useAuth } from '../../context/auth-context'

interface DashboardSidebarProps {
  collapsed?: boolean
  onNavigate?: () => void
}

const commonLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
]

const linksByRole = {
  admin: [
    ...commonLinks,
    { label: 'Lost Reports', path: '/lost-reports', icon: Search },
    { label: 'Found Items', path: '/found-items', icon: PackageSearch },
    { label: 'Claims', path: '/claims', icon: ClipboardCheck },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Categories', path: '/categories', icon: Tags },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Activity Logs', path: '/activity-logs', icon: Activity },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ],
  staff: [
    ...commonLinks,
    { label: 'Lost Reports', path: '/lost-reports', icon: Search },
    { label: 'Found Items', path: '/found-items', icon: PackageSearch },
    { label: 'Claims & Verification', path: '/claims', icon: ClipboardCheck },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ],
 user: [
  ...commonLinks,
  { label: 'My Reports', path: '/report-item', icon: ClipboardCheck },
  { label: 'My Claims', path: '/claims', icon: ClipboardCheck },
  { label: 'Notifications', path: '/notifications', icon: Bell },
],
}

export default function DashboardSidebar({
  collapsed = false,
  onNavigate,
}: DashboardSidebarProps) {
  const { user } = useAuth()
  const links = linksByRole[user?.role ?? 'user']

  return (
    <nav className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-600 font-bold text-white">
          F
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">Findora</span>
        )}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}