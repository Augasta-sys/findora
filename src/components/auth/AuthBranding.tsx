import {
  Search,
  PackageCheck,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react'

function AuthBranding() {
  return (
    <div className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-[28px] bg-[#14213D] p-6 text-white md:p-6 lg:p-9 xl:p-12">

      {/* Background decorations */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Logo */}
<div className="relative z-10 mt-3 flex items-center gap-3">
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 text-[#14213D] shadow-lg shadow-teal-500/20">
    <Search size={23} strokeWidth={2.5} />
  </div>

  <div>
    <h1 className="text-2xl font-bold tracking-tight">
      Findora
    </h1>
    <p className="text-xs text-slate-300">
      Lost & Found Recovery
    </p>
  </div>
</div>

      {/* Main content */}
      <div className="relative z-10 my-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-xs font-medium text-teal-200">
          <ShieldCheck size={15} />
          Your belongings matter
        </span>

        <h2 className="mt-7 max-w-lg text-3xl font-bold leading-tight xl:text-5xl">
          Lost something?
          <br />
          <span className="text-teal-300">
            Let's bring it home.
          </span>
        </h2>

        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 xl:text-base">
          A smarter way to report lost belongings, discover found
          items and reconnect people with what matters to them.
        </p>

        {/* Feature cards */}
        <div className="mt-9 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <PackageCheck className="mb-3 text-teal-300" size={24} />
            <h3 className="text-sm font-semibold">Easy Reporting</h3>
            <p className="mt-1 text-xs text-slate-400">
              Report lost and found items.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <HeartHandshake className="mb-3 text-teal-300" size={24} />
            <h3 className="text-sm font-semibold">Safe Recovery</h3>
            <p className="mt-1 text-xs text-slate-400">
              Verify and recover belongings.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>© 2026 Findora</span>
        <span>Connecting people & belongings</span>
      </div>
    </div>
  )
}

export default AuthBranding