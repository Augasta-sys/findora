import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/theme-context'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle light and dark mode"
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
    >
      {theme === 'light' ? (
        <Moon size={19} />
      ) : (
        <Sun size={19} />
      )}
    </button>
  )
}

export default ThemeToggle