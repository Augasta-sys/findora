import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'

function NotFoundPage() {
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
          <Search size={22} />
        </div>

        <p className="mb-1 text-[10px] font-semibold tracking-[0.15em] text-teal-600 dark:text-teal-400">
          PAGE NOT FOUND
        </p>

        <h2 className="text-5xl font-bold tracking-tight text-[#14213D] dark:text-white">
          404
        </h2>

        <h3 className="mt-2 text-lg font-semibold text-[#14213D] dark:text-white">
          We couldn't find that page
        </h3>

        <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
          The page may have moved, or the address may be incorrect.
        </p>

        <Link
          to="/login"
          className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0F9D8A] px-4 text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0D8A79]"
        >
          <ArrowLeft size={15} />
          Back to Sign In
        </Link>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-3 text-center dark:border-slate-700">
        <p className="text-[10px] text-slate-400">
          Find your way back to Findora
        </p>
      </div>
    </AuthLayout>
  )
}

export default NotFoundPage