import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  LogOut,
  UserRound,
  Sun,
  Moon,
} from 'lucide-react'
import { useAuth } from '../../context/auth-context'
import { useTheme } from '../../context/theme-context'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  function handleSignOut() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 text-slate-900 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:text-white sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Toggle navigation"
        className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Menu size={20} />
      </button>

      <form onSubmit={handleSearch} className="relative min-w-0 flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reports..."
          aria-label="Search reports"
          className="h-10 w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
        />
      </form>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.name ?? 'Account'}</p>
          <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
            {user?.role}
          </p>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
          <UserRound size={18} />
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out"
          aria-label="Sign out"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}