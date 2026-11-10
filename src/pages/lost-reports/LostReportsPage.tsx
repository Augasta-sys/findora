import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, MapPin, CalendarDays, X } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/auth-context'

type LostReport = {
  id: string
  userId: string
  title: string
  categoryId: string
  description: string
  location: string
  dateLost: string
  status: string
}

export default function LostReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<LostReport[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await api.get<LostReport[]>('/lostReports')
        setReports(response.data)
      } catch {
        setError('Unable to load lost reports. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  const visibleReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesUser = user?.role !== 'user' || report.userId === user.id
      const query = search.trim().toLowerCase()

      const matchesSearch =
        !query ||
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query)

      const matchesStatus =
        status === 'All' || report.status.toLowerCase() === status.toLowerCase()

      return matchesUser && matchesSearch && matchesStatus
    })
  }, [reports, search, status, user])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lost Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search and manage reported lost items.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus size={18} />
          Report Lost Item
        </button>
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
            placeholder="Search by item, description, or location"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option>All</option>
          <option>Open</option>
          <option>Matched</option>
          <option>Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading lost reports...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : visibleReports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            No lost reports found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleReports.map((report) => (
            <article
              key={report.id}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  {report.title}
                </h2>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  {report.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {report.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {report.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {report.dateLost}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {isReportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
          onClick={() => setIsReportModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-lost-title"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900"
            style={{ maxHeight: 'calc(100dvh - 24px)' }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2
                id="report-lost-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Report a Lost Item
              </h2>

              <button
                type="button"
                aria-label="Close popup"
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault()
                setIsReportModalOpen(false)
              }}
            >
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Item name
                <input
                  required
                  name="title"
                  placeholder="e.g. Black wallet"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label className="text-sm text-slate-700 dark:text-slate-300">
                Category
                <select
                  required
                  name="categoryId"
                  defaultValue=""
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="cat-1">Electronics</option>
                  <option value="cat-2">Wallets and Bags</option>
                  <option value="cat-3">Keys</option>
                  <option value="cat-4">Documents</option>
                  <option value="cat-5">Other</option>
                </select>
              </label>

              <label className="text-sm text-slate-700 dark:text-slate-300 sm:col-span-2">
                Description
                <textarea
                  required
                  name="description"
                  rows={2}
                  placeholder="Describe the item and identifying details"
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label className="text-sm text-slate-700 dark:text-slate-300">
                Last seen location
                <input
                  required
                  name="location"
                  placeholder="Where did you last see it?"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label className="text-sm text-slate-700 dark:text-slate-300">
                Date lost
                <input
                  required
                  type="date"
                  name="dateLost"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}