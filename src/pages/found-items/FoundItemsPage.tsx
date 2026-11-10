import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Search, Plus, MapPin, CalendarDays, X } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/auth-context'

type FoundItem = {
  id: string
  reportedBy: string
  title: string
  categoryId: string
  description: string
  location: string
  dateFound: string
  status: string
}

const categories = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Wallets and Bags' },
  { id: 'cat-3', name: 'Keys' },
  { id: 'cat-4', name: 'Documents' },
  { id: 'cat-5', name: 'Other' },
]

export default function FoundItemsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<FoundItem[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await api.get<FoundItem[]>('/foundItems')
        setItems(response.data)
      } catch {
        setError('Unable to load found items. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesUser =
        user?.role !== 'user' || item.reportedBy === user.id
      const query = search.trim().toLowerCase()

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)

      const matchesStatus =
        status === 'All' || item.status.toLowerCase() === status.toLowerCase()

      return matchesUser && matchesSearch && matchesStatus
    })
  }, [items, search, status, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    if (!user) {
      setSubmitError('Please sign in before reporting a found item.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const newItem = {
      reportedBy: user.id,
      title: String(formData.get('title') ?? '').trim(),
      categoryId: String(formData.get('categoryId') ?? ''),
      description: String(formData.get('description') ?? '').trim(),
      location: String(formData.get('location') ?? '').trim(),
      dateFound: String(formData.get('dateFound') ?? ''),
      status: 'Available',
    }

    if (
      !newItem.title ||
      !newItem.categoryId ||
      !newItem.description ||
      !newItem.location ||
      !newItem.dateFound
    ) {
      setSubmitError('Please complete all fields.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await api.post<FoundItem>('/foundItems', newItem)
      setItems((current) => [response.data, ...current])
      setIsModalOpen(false)
    } catch {
      setSubmitError('Unable to submit the report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Found Items
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse and manage items that have been found.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitError('')
            setIsModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus size={18} />
          Report Found Item
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
            aria-label="Search found items"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option>All</option>
          <option>Available</option>
          <option>Claimed</option>
          <option>Returned</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading found items...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            No found items match your search
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h2>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {item.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {item.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {item.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {item.dateFound}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
          onClick={() => setIsModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-found-title"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900"
            style={{ maxHeight: 'calc(100dvh - 24px)' }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2
                id="report-found-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Report a Found Item
              </h2>
              <button
                type="button"
                aria-label="Close popup"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 overflow-y-auto p-5 sm:grid-cols-2"
            >
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Item name
                <input
                  required
                  name="title"
                  placeholder="e.g. Blue water bottle"
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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
                Found location
                <input
                  required
                  name="location"
                  placeholder="Where was it found?"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label className="text-sm text-slate-700 dark:text-slate-300">
                Date found
                <input
                  required
                  type="date"
                  name="dateFound"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              {submitError && (
                <p className="text-sm text-red-600 dark:text-red-400 sm:col-span-2">
                  {submitError}
                </p>
              )}

              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}