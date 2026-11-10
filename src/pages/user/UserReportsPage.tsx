import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth-context';

const API_URL = 'http://localhost:5000';

type ReportType = 'lost' | 'found';

export default function UserReportsPage() {
  const { user } = useAuth();

  const [reportType, setReportType] = useState<ReportType>('lost');
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    description: '',
    location: '',
    date: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    const endpoint = reportType === 'lost' ? '/lostReports' : '/foundItems';

    const payload =
      reportType === 'lost'
        ? {
            id: `lost-${Date.now()}`,
            title: form.title.trim(),
            categoryId: form.categoryId,
            description: form.description.trim(),
            location: form.location.trim(),
            dateLost: form.date,
            reportedBy: user?.id,
            status: 'Pending',
          }
        : {
            id: `found-${Date.now()}`,
            title: form.title.trim(),
            categoryId: form.categoryId,
            description: form.description.trim(),
            location: form.location.trim(),
            dateFound: form.date,
            reportedBy: user?.id,
            status: 'Available',
          };

    try {
      setSaving(true);
      await axios.post(`${API_URL}${endpoint}`, payload);

      setMessage(
        reportType === 'lost'
          ? 'Lost item report submitted.'
          : 'Found item report submitted.'
      );

      setForm({
        title: '',
        categoryId: '',
        description: '',
        location: '',
        date: '',
      });
    } catch {
      setError('Could not submit the report. Please check that JSON Server is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Report an Item
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Submit details about an item you lost or found.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setReportType('lost');
            setMessage('');
            setError('');
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            reportType === 'lost'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          Report Lost Item
        </button>

        <button
          type="button"
          onClick={() => {
            setReportType('found');
            setMessage('');
            setError('');
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            reportType === 'found'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          Report Found Item
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {reportType === 'lost' ? 'Lost item details' : 'Found item details'}
        </h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Item name *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
            placeholder="e.g. Blue backpack"
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category ID
          </label>
          <input
            name="categoryId"
            value={form.categoryId}
            onChange={updateField}
            placeholder="Enter category ID, if available"
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            required
            rows={3}
            placeholder="Describe the item and any identifying details"
            className="w-full resize-y rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {reportType === 'lost' ? 'Where did you lose it?' : 'Where did you find it?'} *
          </label>
          <input
            name="location"
            value={form.location}
            onChange={updateField}
            required
            placeholder="Enter location"
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={updateField}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Submitting…' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}