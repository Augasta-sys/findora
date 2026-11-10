
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Search, Plus, Pencil, Trash2, X, Tags } from 'lucide-react'
import api from '../../services/api'

type Category = {
  id: string
  name: string
  description?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories')

        if (active) {
          setCategories(response.data)
          setError('')
        }
      } catch {
        if (active) {
          setError(
            'Unable to load categories. Check your API connection.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchCategories()

    return () => {
      active = false
    }
  }, [])

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        `${category.name} ${category.description ?? ''}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [categories, search],
  )

  const openCreateModal = () => {
    setEditingCategory(null)
    setName('')
    setDescription('')
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setDescription(category.description ?? '')
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Please enter a category name.')
      return
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        category.id !== editingCategory?.id,
    )

    if (duplicate) {
      setError('A category with this name already exists.')
      return
    }

    const payload = {
      name: trimmedName,
      description: description.trim(),
    }

    setSaving(true)
    setError('')

    try {
      if (editingCategory) {
        const response = await api.patch<Category>(
          `/categories/${editingCategory.id}`,
          payload,
        )

        setCategories((current) =>
          current.map((category) =>
            category.id === editingCategory.id ? response.data : category,
          ),
        )
      } else {
        const response = await api.post<Category>(
          '/categories',
          payload,
        )

        setCategories((current) => [...current, response.data])
      }

      setModalOpen(false)
      setEditingCategory(null)
    } catch {
      setError('Could not save this category. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Delete the "${category.name}" category?`,
    )

    if (!confirmed) return

    try {
      await api.delete(`/categories/${category.id}`)

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      )
    } catch {
      setError('Could not delete this category. Please try again.')
    }
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage item categories used in lost and found reports.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Category
        </button>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <label className="relative block max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
      </section>

      {error && !modalOpen && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading categories…</p>
      ) : filteredCategories.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <Tags className="mx-auto mb-3 text-slate-400" size={28} />
          <p className="font-medium text-slate-800 dark:text-white">
            No categories found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add a category or try another search.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <Tags size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-slate-900 dark:text-white">
                      {category.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      ID: {category.id}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => openEditModal(category)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${category.name}`}
                    onClick={() => void handleDelete(category)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="mt-4 min-h-10 text-sm text-slate-600 dark:text-slate-300">
                {category.description || 'No description provided.'}
              </p>
            </article>
          ))}
        </section>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onClick={closeModal}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="category-modal-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>

              <button
                type="button"
                aria-label="Close category form"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Category name *
                </label>

                <input
                  id="category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={60}
                  placeholder="e.g. Electronics"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  maxLength={250}
                  placeholder="Briefly describe this category"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {error && (
                <p className="text-sm text-rose-500" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving
                    ? 'Saving…'
                    : editingCategory
                      ? 'Save Changes'
                      : 'Create Category'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
