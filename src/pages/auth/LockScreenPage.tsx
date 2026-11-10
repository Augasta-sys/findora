import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LockKeyhole, ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

function LockScreenPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!password) {
      setError('Password is required')
      return
    }

    if (password.length < 6) {
      setError('Minimum 6 characters required')
      return
    }

    // Lock-screen authentication will be connected later.
    setSuccessMessage('Password validation successful!')
  }

  return (
    <AuthLayout>
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
          <LockKeyhole size={21} />
        </div>

        <p className="mb-1 text-[10px] font-semibold tracking-[0.15em] text-teal-600 dark:text-teal-400">
          SESSION LOCKED
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-[#14213D] dark:text-white sm:text-3xl">
          Welcome back
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Enter your password to continue to Findora.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <label
            htmlFor="lock-password"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Password
          </label>

          <PasswordInput
            id="lock-password"
            value={password}
            onChange={(value) => {
              setPassword(value)
              setError('')
              setSuccessMessage('')
            }}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={error}
          />
        </div>

        {successMessage && (
          <p className="rounded-lg bg-teal-50 px-2.5 py-2 text-[11px] text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          className="group flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0F9D8A] text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0D8A79] active:translate-y-0"
        >
          Unlock Account
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      <Link
        to="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
      >
        Sign in with another account
      </Link>

      <div className="mt-4 border-t border-slate-200 pt-3 text-center dark:border-slate-700">
        <p className="text-[10px] text-slate-400">
          Your Findora session is protected
        </p>
      </div>
    </AuthLayout>
  )
}

export default LockScreenPage