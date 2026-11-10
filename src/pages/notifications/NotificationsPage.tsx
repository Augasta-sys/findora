
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Bell, CheckCheck, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/auth-context'

type Notification = {
  id: string
  userId?: string
  title?: string
  message?: string
  read?: boolean
  createdAt?: string
}

const API_URL = 'http://localhost:5000'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get<Notification[]>(
        `${API_URL}/notifications`,
      )

      const userNotifications = response.data.filter(
        (notification) =>
          !notification.userId || notification.userId === user?.id,
      )

      setNotifications(userNotifications)
    } catch {
      setError(
        'Unable to load notifications. Check that JSON Server is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchNotifications = async () => {
      try {
        const response = await axios.get<Notification[]>(
          `${API_URL}/notifications`,
        )

        const userNotifications = response.data.filter(
          (notification) =>
            !notification.userId || notification.userId === user?.id,
        )

        if (active) {
          setNotifications(userNotifications)
          setError('')
        }
      } catch {
        if (active) {
          setError(
            'Unable to load notifications. Check that JSON Server is running.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchNotifications()

    return () => {
      active = false
    }
  }, [user?.id])

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  const markAsRead = async (notification: Notification) => {
    if (notification.read) return

    try {
      await axios.patch(
        `${API_URL}/notifications/${notification.id}`,
        { read: true },
      )

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item,
        ),
      )
    } catch {
      setError(
        'Could not mark this notification as read. Please try again.',
      )
    }
  }

  const markAllAsRead = async () => {
    const unread = notifications.filter(
      (notification) => !notification.read,
    )

    try {
      await Promise.all(
        unread.map((notification) =>
          axios.patch(
            `${API_URL}/notifications/${notification.id}`,
            { read: true },
          ),
        ),
      )

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      )
    } catch {
      setError(
        'Could not mark all notifications as read. Please try again.',
      )
    }
  }

  const formatDate = (value?: string) => {
    if (!value) return '—'

    const date = new Date(value)

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString()
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stay up to date with your Findora activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadNotifications()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => void markAllAsRead()}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            <Bell size={20} />
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unread notifications
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {unreadCount}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20">
          {error}
        </p>
      )}

      <section className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">
            Loading notifications…
          </p>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <Bell
              className="mx-auto mb-3 text-slate-400"
              size={28}
            />
            <p className="font-medium text-slate-800 dark:text-white">
              No notifications yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New notifications will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5 ${
                notification.read
                  ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  : 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30'
              }`}
            >
              <div className="flex min-w-0 gap-3">
                <div className="mt-1 shrink-0 text-indigo-500">
                  <Bell size={18} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      {notification.title || 'Notification'}
                    </h2>

                    {!notification.read && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
                    {notification.message || 'No additional details.'}
                  </p>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>

              {!notification.read && (
                <button
                  type="button"
                  onClick={() => void markAsRead(notification)}
                  className="shrink-0 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Mark as read
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  )
}
