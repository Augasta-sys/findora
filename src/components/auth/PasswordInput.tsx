
import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, AlertCircle } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  autoComplete?: string
  id?: string
}

function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  autoComplete = 'current-password',
  id = 'password',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className={`flex h-9 w-full items-center gap-2 rounded-lg border bg-white px-2.5 transition-all dark:bg-[#151F32] ${
        error
          ? 'border-red-500'
          : 'border-slate-200 focus-within:border-teal-500 dark:border-slate-700'
      }`}
    >
      <LockKeyhole
        size={15}
        className="shrink-0 text-slate-400"
      />

      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="h-full min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
      />

      {error && (
        <div className="group relative flex shrink-0 items-center">
          <AlertCircle
            size={15}
            className="cursor-help text-red-500"
            tabIndex={0}
          />

          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 w-max max-w-[200px] rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {error}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="flex shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-teal-500"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

export default PasswordInput
