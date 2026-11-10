import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <DashboardSidebar
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <div
        className={`min-h-screen transition-all duration-200 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <DashboardHeader
          onMenuClick={() => {
            if (window.matchMedia('(min-width: 768px)').matches) {
              setCollapsed((value) => !value)
            } else {
              setMobileOpen((value) => !value)
            }
          }}
        />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}