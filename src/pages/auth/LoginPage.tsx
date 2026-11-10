import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { Mail, ArrowRight, AlertCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const [successMessage, setSuccessMessage] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required'
  } else if (
  !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email.trim())
) {
  newErrors.email = 'Please enter a valid email address'
}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 characters required'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateForm()) return

    try {
      await signIn(email.trim().toLowerCase(), password)
      navigate('/dashboard')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to sign in'

      setErrors((prev) => ({
        ...prev,
        password: message,
      }))
    }
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-4 md:mb-3">
        <p className="mb-1 text-[10px] font-semibold tracking-[0.15em] text-teal-600 dark:text-teal-400">
          WELCOME BACK
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-[#14213D] dark:text-white sm:text-3xl">
          Sign in to Findora
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Welcome back! Enter your details to access your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-3"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Email Address
          </label>

          <div
            className={`flex h-9 w-full items-center gap-2 rounded-lg border bg-white px-2.5 transition-all dark:bg-[#151F32] ${
              errors.email
                ? 'border-red-500'
                : 'border-slate-200 focus-within:border-teal-500 dark:border-slate-700'
            }`}
          >
            <Mail size={15} className="shrink-0 text-slate-400" />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase())
                setErrors((prev) => ({ ...prev, email: '' }))
                setSuccessMessage('')
              }}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="h-full min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />

            {errors.email && (
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
                  {errors.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold text-slate-700 dark:text-slate-200"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-[10px] font-semibold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400"
            >
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="password"
            value={password}
            onChange={(value) => {
              setPassword(value)
              setErrors((prev) => ({ ...prev, password: '' }))
              setSuccessMessage('')
            }}
            placeholder="Enter your password"
            error={errors.password}
          />
        </div>

        {/* Remember me */}
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-3.5 w-3.5 accent-teal-600"
          />

          <span className="text-[11px] text-slate-600 dark:text-slate-400">
            Remember me
          </span>
        </label>

        {/* Success message */}
        {successMessage && (
          <p className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-[11px] text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
            {successMessage}
          </p>
        )}

        {/* Sign In */}
        <button
          type="submit"
          className="group flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0F9D8A] text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0D8A79] hover:shadow-lg active:translate-y-0"
        >
          Sign In

          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* Sign up */}
      <p className="mt-4 text-center text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400"
        >
          Create an account
        </Link>
      </p>

      {/* Footer */}
      <div className="mt-4 border-t border-slate-200 pt-3 text-center dark:border-slate-700">
        <p className="text-[10px] text-slate-400">
          Secure access to your Lost & Found account
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
