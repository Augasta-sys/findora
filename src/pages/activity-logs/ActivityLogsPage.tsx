
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Search, Activity, RefreshCw } from 'lucide-react'

type ActivityLog = {
  id: string
  userId?: string
  userName?: string
  action?: string
  description?: string
  createdAt?: string
  timestamp?: string
}

const API_URL = 'http://localhost:5000'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLogs = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get<ActivityLog[]>(
        `${API_URL}/activityLogs`,
      )
      setLogs(response.data)
    } catch {
      setError(
        'Unable to load activity logs. Check that JSON Server is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchLogs = async () => {
      try {
        const response = await axios.get<ActivityLog[]>(
          `${API_URL}/activityLogs`,
        )

        if (active) {
          setLogs(response.data)
          setError('')
        }
      } catch {
        if (active) {
          setError(
            'Unable to load activity logs. Check that JSON Server is running.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchLogs()

    return () => {
      active = false
    }
  }, [])

  const actionTypes = useMemo(
    () =>
      [...new Set(logs.map((log) => log.action).filter(Boolean))] as string[],
    [logs],
  )

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase()

    return logs.filter((log) => {
      const searchableText = [
        log.userName,
        log.userId,
        log.action,
        log.description,
        log.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(query)
      const matchesAction =
        actionFilter === 'All' || log.action === actionFilter

      return matchesSearch && matchesAction
    })
  }, [logs, search, actionFilter])

  const formatDate = (log: ActivityLog) => {
    const value = log.createdAt ?? log.timestamp

    if (!value) return '—'

    const date = new Date(value)

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString()
  }

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Activity Logs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review recent actions recorded in Findora.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadLogs()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total activity records
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {logs.length}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Action types recorded
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {actionTypes.length}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search user, action, or description"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <select
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="All">All action types</option>
            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">
            Loading activity logs…
          </p>
        ) : error ? (
          <p className="p-6 text-sm text-rose-500">{error}</p>
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 text-center">
            <Activity
              className="mx-auto mb-3 text-slate-400"
              size={28}
            />
            <p className="font-medium text-slate-800 dark:text-white">
              No activity records found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Activity records will appear here when available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                  <th className="px-5 py-4 font-semibold">Description</th>
                  <th className="px-5 py-4 font-semibold">
                    Date & time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {log.userName || log.userId || 'Unknown user'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        ID: {log.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-700 dark:text-slate-200">
                      {log.action || '—'}
                    </td>

                    <td className="max-w-md px-5 py-4 text-slate-600 dark:text-slate-300">
                      {log.description || '—'}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">
                      {formatDate(log)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
