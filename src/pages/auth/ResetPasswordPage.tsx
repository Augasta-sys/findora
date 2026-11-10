import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  })
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccessMessage('')

    const nextErrors = {
      password: '',
      confirmPassword: '',
    }

    if (!password) {
      nextErrors.password = 'Password is required'
    } else if (password.length < 6) {
      nextErrors.password = 'Minimum 6 characters required'
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(nextErrors)

    if (nextErrors.password || nextErrors.confirmPassword) return

    // Password reset API will be connected later.
    setSuccessMessage('Password validation successful!')
  }

  return (
    <AuthLayout>
      <div className="mb-4 md:mb-3">
        <p className="mb-1 text-[10px] font-semibold tracking-[0.15em] text-teal-600 dark:text-teal-400">
          ACCOUNT RECOVERY
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-[#14213D] dark:text-white sm:text-3xl">
          Reset password
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Create a new password with at least 6 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <label
            htmlFor="reset-password"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            New Password
          </label>

          <PasswordInput
            id="reset-password"
            value={password}
            onChange={(value) => {
              setPassword(value)
              setErrors((prev) => ({
                ...prev,
                password: '',
                confirmPassword: '',
              }))
              setSuccessMessage('')
            }}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            error={errors.password}
          />
        </div>

        <div>
          <label
            htmlFor="reset-confirm-password"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Confirm Password
          </label>

          <PasswordInput
            id="reset-confirm-password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value)
              setErrors((prev) => ({ ...prev, confirmPassword: '' }))
              setSuccessMessage('')
            }}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            error={errors.confirmPassword}
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
          Reset Password
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      <Link
        to="/login"
        className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
      >
        <ArrowLeft size={14} />
        Back to Sign In
      </Link>

      <div className="mt-4 border-t border-slate-200 pt-3 text-center dark:border-slate-700">
        <p className="text-[10px] text-slate-400">
          Secure account recovery with Findora
        </p>
      </div>
    </AuthLayout>
  )
}

export default ResetPasswordPage