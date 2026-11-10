
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  BarChart3,
  PackageSearch,
  PackageCheck,
  ClipboardList,
  RefreshCw,
} from 'lucide-react'

type LostReport = {
  id: string
  status?: string
}

type FoundItem = {
  id: string
  status?: string
}

type Claim = {
  id: string
  status?: string
}

const API_URL = 'http://localhost:5000'

export default function ReportsPage() {
  const [lostReports, setLostReports] = useState<LostReport[]>([])
  const [foundItems, setFoundItems] = useState<FoundItem[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReports = async () => {
    setLoading(true)
    setError('')

    try {
      const [lostResponse, foundResponse, claimsResponse] =
        await Promise.all([
          axios.get<LostReport[]>(`${API_URL}/lostReports`),
          axios.get<FoundItem[]>(`${API_URL}/foundItems`),
          axios.get<Claim[]>(`${API_URL}/claims`),
        ])

      setLostReports(lostResponse.data)
      setFoundItems(foundResponse.data)
      setClaims(claimsResponse.data)
    } catch {
      setError(
        'Unable to load report data. Check that JSON Server is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchReports = async () => {
      try {
        const [lostResponse, foundResponse, claimsResponse] =
          await Promise.all([
            axios.get<LostReport[]>(`${API_URL}/lostReports`),
            axios.get<FoundItem[]>(`${API_URL}/foundItems`),
            axios.get<Claim[]>(`${API_URL}/claims`),
          ])

        if (active) {
          setLostReports(lostResponse.data)
          setFoundItems(foundResponse.data)
          setClaims(claimsResponse.data)
          setError('')
        }
      } catch {
        if (active) {
          setError(
            'Unable to load report data. Check that JSON Server is running.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchReports()

    return () => {
      active = false
    }
  }, [])

  const claimCounts = useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      other: 0,
    }

    claims.forEach((claim) => {
      const status = (claim.status ?? '').toLowerCase()

      if (status === 'pending') counts.pending += 1
      else if (status === 'approved' || status === 'verified') {
        counts.approved += 1
      } else if (status === 'rejected') {
        counts.rejected += 1
      } else {
        counts.other += 1
      }
    })

    return counts
  }, [claims])

  const recoveredCount = foundItems.filter((item) => {
    const status = (item.status ?? '').toLowerCase()

    return (
      status === 'claimed' ||
      status === 'recovered' ||
      status === 'returned'
    )
  }).length

  const summaryCards = [
    {
      label: 'Lost Reports',
      value: lostReports.length,
      detail: 'Total submitted reports',
      icon: PackageSearch,
      iconClass:
        'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'Found Items',
      value: foundItems.length,
      detail: 'Total found item records',
      icon: PackageCheck,
      iconClass:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Claims',
      value: claims.length,
      detail: `${claimCounts.pending} pending`,
      icon: ClipboardList,
      iconClass:
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
    {
      label: 'Recovered Items',
      value: recoveredCount,
      detail: 'Based on found-item status',
      icon: BarChart3,
      iconClass:
        'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
    },
  ]

  const maxStatusCount = Math.max(
    claimCounts.pending,
    claimCounts.approved,
    claimCounts.rejected,
    claimCounts.other,
    1,
  )

  const claimStatuses = [
    {
      label: 'Pending',
      value: claimCounts.pending,
      color: 'bg-amber-500',
    },
    {
      label: 'Approved / Verified',
      value: claimCounts.approved,
      color: 'bg-emerald-500',
    },
    {
      label: 'Rejected',
      value: claimCounts.rejected,
      color: 'bg-rose-500',
    },
    {
      label: 'Other',
      value: claimCounts.other,
      color: 'bg-slate-400',
    },
  ]

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of lost reports, found items, and claims.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadReports()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh data
        </button>
      </header>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading analytics…</p>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon

              return (
                <article
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {card.value}
                      </p>
                    </div>

                    <div className={`rounded-xl p-3 ${card.iconClass}`}>
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {card.detail}
                  </p>
                </article>
              )
            })}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Claim Status Breakdown
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Current distribution of claim statuses.
              </p>

              <div className="mt-6 space-y-5">
                {claimStatuses.map((status) => (
                  <div key={status.label}>
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        {status.label}
                      </span>

                      <span className="font-semibold text-slate-900 dark:text-white">
                        {status.value}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full ${status.color}`}
                        style={{
                          width: `${(status.value / maxStatusCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Record Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Relative number of records in each section.
              </p>

              <div className="mt-6 space-y-5">
                {[
                  {
                    label: 'Lost reports',
                    value: lostReports.length,
                    color: 'bg-amber-500',
                  },
                  {
                    label: 'Found items',
                    value: foundItems.length,
                    color: 'bg-emerald-500',
                  },
                  {
                    label: 'Claims',
                    value: claims.length,
                    color: 'bg-indigo-500',
                  },
                ].map((record) => {
                  const maxRecordCount = Math.max(
                    lostReports.length,
                    foundItems.length,
                    claims.length,
                    1,
                  )

                  return (
                    <div key={record.label}>
                      <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="text-slate-600 dark:text-slate-300">
                          {record.label}
                        </span>

                        <span className="font-semibold text-slate-900 dark:text-white">
                          {record.value}
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${record.color}`}
                          style={{
                            width: `${(record.value / maxRecordCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  )
}
