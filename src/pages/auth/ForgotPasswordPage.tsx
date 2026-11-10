import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setError('')
  setSuccessMessage('')

  if (!email.trim()) {
    setError('Email address is required')
    return
  }

  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    setError('Please enter a valid lowercase email address')
    return
  }

  navigate('/reset-password')
}

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-4 md:mb-3">
        <p className="mb-1 text-[10px] font-semibold tracking-[0.15em] text-teal-600 dark:text-teal-400">
          ACCOUNT RECOVERY
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-[#14213D] dark:text-white sm:text-3xl">
          Forgot password?
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Don't worry! Enter your registered email address to start
          the password recovery process.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-3"
      >
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Email Address
          </label>

          <div
            className={`flex h-9 w-full items-center gap-2 rounded-lg border bg-white px-2.5 transition-all dark:bg-[#151F32] ${
              error
                ? 'border-red-500'
                : 'border-slate-200 focus-within:border-teal-500 dark:border-slate-700'
            }`}
          >
            <Mail size={15} className="shrink-0 text-slate-400" />

            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase())
                setError('')
                setSuccessMessage('')
              }}
              placeholder="name@example.com"
              autoComplete="email"
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
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <p className="rounded-lg bg-teal-50 px-2.5 py-2 text-[11px] leading-5 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
            {successMessage}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="group flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0F9D8A] text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0D8A79] hover:shadow-lg active:translate-y-0"
        >
          Send Reset Instructions

          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* Back to login */}
      <Link
        to="/login"
        className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400"
      >
        <ArrowLeft size={14} />
        Back to Sign In
      </Link>

      {/* Footer */}
      <div className="mt-4 border-t border-slate-200 pt-3 text-center dark:border-slate-700">
        <p className="text-[10px] text-slate-400">
          Secure account recovery with Findora
        </p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
