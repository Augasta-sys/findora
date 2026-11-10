import { useEffect, useMemo, useState } from 'react'
import { Search, X, CalendarDays, FileText } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/auth-context'

type Claim = {
  id: string
  foundItemId?: string
  itemTitle?: string
  claimedBy?: string
  userId?: string
  proof?: string
  description?: string
  status: string
  createdAt?: string
  dateClaimed?: string
}

export default function ClaimsPage() {
  const { user } = useAuth()
  const [claims, setClaims] = useState<Claim[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)

  useEffect(() => {
    async function loadClaims() {
      try {
        const response = await api.get<Claim[]>('/claims')
        setClaims(response.data)
      } catch {
        setError('Unable to load claims. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadClaims()
  }, [])

  const visibleClaims = useMemo(() => {
    return claims.filter((claim) => {
      const claimOwner = claim.claimedBy ?? claim.userId
      const matchesUser = user?.role !== 'user' || claimOwner === user.id
      const query = search.trim().toLowerCase()
      const itemTitle = claim.itemTitle ?? claim.foundItemId ?? ''

      const matchesSearch =
        !query ||
        itemTitle.toLowerCase().includes(query) ||
        (claim.description ?? '').toLowerCase().includes(query) ||
        claim.id.toLowerCase().includes(query)

      const matchesStatus =
        status === 'All' || claim.status.toLowerCase() === status.toLowerCase()

      return matchesUser && matchesSearch && matchesStatus
    })
  }, [claims, search, status, user])

  const statusClass = (claimStatus: string) => {
    const normalized = claimStatus.toLowerCase()

    if (normalized === 'approved' || normalized === 'verified') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    }

    if (normalized === 'rejected' || normalized === 'denied') {
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }

    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Claims
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review and track claims for found items.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by item or claim ID"
            aria-label="Search claims"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter claims by status"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Verified</option>
          <option>Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading claims...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : visibleClaims.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <FileText className="mx-auto mb-3 text-slate-400" size={28} />
          <p className="font-medium text-slate-800 dark:text-slate-200">
            No claims found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Claims will appear here when someone submits a claim for a found item.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Claim ID</th>
                  <th className="px-5 py-3 font-semibold">Item</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visibleClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">
                      {claim.id}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-200">
                      {claim.itemTitle ?? claim.foundItemId ?? 'Found item'}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {claim.dateClaimed ?? claim.createdAt ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(claim.status)}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedClaim(claim)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-900/30"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClaim && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
          onClick={() => setSelectedClaim(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-details-title"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900"
            style={{ maxHeight: 'calc(100dvh - 24px)' }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2
                id="claim-details-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Claim Details
              </h2>
              <button
                type="button"
                aria-label="Close claim details"
                onClick={() => setSelectedClaim(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-5">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Claim ID
                </p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {selectedClaim.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Item
                </p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {selectedClaim.itemTitle ??
                    selectedClaim.foundItemId ??
                    'Found item'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(selectedClaim.status)}`}
                >
                  {selectedClaim.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Claim description / proof
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {selectedClaim.proof ??
                    selectedClaim.description ??
                    'No claim description was provided.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CalendarDays size={16} />
                {selectedClaim.dateClaimed ??
                  selectedClaim.createdAt ??
                  'Date not available'}
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}