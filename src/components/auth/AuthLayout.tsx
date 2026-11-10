import type { ReactNode } from 'react'
import AuthBranding from './AuthBranding'
import ThemeToggle from '../common/ThemeToggle'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[#F8FAFC] p-2 dark:bg-[#0B1220] sm:p-3 md:h-[100svh] md:overflow-hidden md:p-3 lg:p-4">
      <div className="mx-auto grid min-h-[calc(100svh-16px)] max-w-[1800px] grid-cols-1 gap-3 sm:min-h-[calc(100svh-24px)] md:h-full md:min-h-0 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">

        {/* Branding panel - Laptop and Tablet */}
        <div className="hidden min-h-0 md:block">
          <AuthBranding />
        </div>

        {/* Authentication panel */}
       <section className="relative flex min-h-[calc(100svh-24px)] items-center justify-center px-3 py-8 sm:px-6 md:min-h-0 md:px-5 md:py-4 lg:px-8 xl:px-12">

          {/* Theme toggle */}
          <div className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4 md:right-3 md:top-3 lg:right-5 lg:top-5">
            <ThemeToggle />
          </div>

          <div className="w-full max-w-[440px]">

            {/* Mobile branding */}
            <div className="mb-4 flex items-center gap-3 md:hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white">
                <span className="text-xl font-bold">F</span>
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#14213D] dark:text-white">
                  Findora
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lost & Found Recovery
                </p>
              </div>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout