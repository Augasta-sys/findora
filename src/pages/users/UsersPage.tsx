
import { useEffect, useMemo, useState } from 'react'
import { Search, Eye, X, Users, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/auth-context'
import api from '../../services/api'

type AppUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'user'
  status?: 'Active' | 'Inactive'
  createdAt?: string
}

export default function UsersPage() {
  const { user } = useAuth()

  const [users, setUsers] = useState<AppUser[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        setError('')

        const response = await api.get<AppUser[]>('/users')

        if (active) {
          setUsers(response.data)
        }
      } catch {
        if (active) {
          setError(
            'Unable to load users. Check your backend connection.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      active = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const searchTerm = search.toLowerCase()

      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm)

      const matchesRole =
        roleFilter === 'All' || item.role === roleFilter

      const matchesStatus =
        statusFilter === 'All' ||
        (item.status ?? 'Active') === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const roleLabel = (role: AppUser['role']) =>
    role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'User'

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Users Management
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage Findora users.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <Users size={18} className="text-indigo-500" />

          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {users.length} users
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or user ID"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="All">All roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">
            Loading users…
          </p>
        ) : error ? (
          <p className="p-6 text-sm text-rose-500">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            No users match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Joined</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {roleLabel(item.role)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {item.status ?? 'Active'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedUser(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-details-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2
                  id="user-details-title"
                  className="text-lg font-semibold text-slate-900 dark:text-white"
                >
                  User Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Account information
                </p>
              </div>

              <button
                type="button"
                aria-label="Close user details"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {selectedUser.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-1 break-all font-medium text-slate-900 dark:text-white">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {roleLabel(selectedUser.role)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 font-medium text-slate-900 dark:text-white">
                  {selectedUser.status ?? 'Active'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">User ID</p>
                <p className="mt-1 break-all font-medium text-slate-900 dark:text-white">
                  {selectedUser.id}
                </p>
              </div>

              {user?.id === selectedUser.id && (
                <p className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck size={14} />
                  This is your account.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
