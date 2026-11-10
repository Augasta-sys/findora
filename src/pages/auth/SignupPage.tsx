import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import {
  UserRound,
  Mail,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

function ErrorTooltip({ message }: { message: string }) {
  if (!message) return null

  return (
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
        {message}
      </span>
    </div>
  )
}

function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  })

  const [successMessage, setSuccessMessage] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      newErrors.name = 'Full name is required'
    } else if (!/^\p{L}+(?:\s+\p{L}+)*$/u.test(trimmedName)) {
      newErrors.name = 'Name must contain letters only'
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (
      !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email.trim())
    ) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 characters required'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Please accept the terms and conditions'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateForm()) return

    try {
      await signUp(name.trim(), email.trim().toLowerCase(), password)
      navigate('/dashboard')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create account'

      setErrors((prev) => ({
        ...prev,
        email: message,
      }))
    }
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-3 md:mb-2.5">
        <p className="mb-1 text-[10px] font-semibold tracking-[0.15em] text-teal-600 dark:text-teal-400">
          GET STARTED
        </p>

        <h2 className="text-xl font-bold tracking-tight text-[#14213D] dark:text-white sm:text-2xl">
          Create your account
        </h2>

        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
          Join Findora and reconnect with your belongings.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Full Name
          </label>

          <div
            className={`flex h-9 items-center gap-2 rounded-lg border bg-white px-2.5 transition-all dark:bg-[#151F32] ${
              errors.name
                ? 'border-red-500'
                : 'border-slate-200 focus-within:border-teal-500 dark:border-slate-700'
            }`}
          >
            <UserRound size={15} className="shrink-0 text-slate-400" />

            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\p{L}\s]/gu, '')
                setName(value)
                setErrors((prev) => ({ ...prev, name: '' }))
                setSuccessMessage('')
              }}
              placeholder="Enter your full name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className="h-full min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />

            <ErrorTooltip message={errors.name} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="signup-email"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Email Address
          </label>

          <div
            className={`flex h-9 items-center gap-2 rounded-lg border bg-white px-2.5 transition-all dark:bg-[#151F32] ${
              errors.email
                ? 'border-red-500'
                : 'border-slate-200 focus-within:border-teal-500 dark:border-slate-700'
            }`}
          >
            <Mail size={15} className="shrink-0 text-slate-400" />

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value.toLowerCase().trim())
                setErrors((prev) => ({ ...prev, email: '' }))
                setSuccessMessage('')
              }}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="h-full min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />

            <ErrorTooltip message={errors.email} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="signup-password"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Password
          </label>

          <PasswordInput
            id="signup-password"
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-200"
          >
            Confirm Password
          </label>

          <PasswordInput
            id="confirm-password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value)
              setErrors((prev) => ({
                ...prev,
                confirmPassword: '',
              }))
              setSuccessMessage('')
            }}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center justify-between gap-2">
          <label className="flex min-w-0 cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => {
                setAcceptedTerms(event.target.checked)
                setErrors((prev) => ({ ...prev, terms: '' }))
                setSuccessMessage('')
              }}
              className="h-3.5 w-3.5 shrink-0 accent-teal-600"
            />

            <span className="text-[10px] leading-4 text-slate-600 dark:text-slate-400 sm:text-[11px]">
              I agree to the{' '}
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                Terms & Conditions
              </span>{' '}
              and Privacy Policy.
            </span>
          </label>

          <ErrorTooltip message={errors.terms} />
        </div>

        {successMessage && (
          <p className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-[11px] text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
            {successMessage}
          </p>
        )}

        {/* Create Account */}
        <button
          type="submit"
          className="group flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0F9D8A] text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0D8A79] hover:shadow-lg active:translate-y-0"
        >
          Create Account
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* Login navigation */}
      <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          Sign in
        </Link>
      </p>

      {/* Footer */}
      <div className="mt-3 border-t border-slate-200 pt-2.5 text-center dark:border-slate-700">
        <p className="text-[10px] text-slate-400">
          Secure registration with Findora
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignupPage