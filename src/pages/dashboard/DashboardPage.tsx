
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '../../context/auth-context'
import api from '../../services/api'

type RecordItem = {
  id: string | number
  status?: string
  userId?: string
  dateLost?: string
  dateFound?: string
}

type DashboardData = {
  users: RecordItem[]
  lostReports: RecordItem[]
  foundItems: RecordItem[]
  claims: RecordItem[]
  verifications: RecordItem[]
  handovers: RecordItem[]
}

const emptyData: DashboardData = {
  users: [],
  lostReports: [],
  foundItems: [],
  claims: [],
  verifications: [],
  handovers: [],
}

const chartColors = ['#0d9488', '#6366f1', '#f59e0b', '#e879f9', '#22c55e']

function normalizeStatus(status?: string) {
  return status?.trim().toLowerCase() ?? ''
}

function countStatuses(items: RecordItem[]) {
  const counts: Record<string, number> = {}

  items.forEach((item) => {
    const status = item.status?.trim() || 'Unspecified'
    counts[status] = (counts[status] ?? 0) + 1
  })

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
  }))
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const resources = Object.keys(emptyData) as (keyof DashboardData)[]

        const responses = await Promise.all(
          resources.map((resource) =>
            api.get<RecordItem[]>(`/${resource}`),
          ),
        )

        if (!cancelled) {
          setData({
            users: responses[0].data,
            lostReports: responses[1].data,
            foundItems: responses[2].data,
            claims: responses[3].data,
            verifications: responses[4].data,
            handovers: responses[5].data,
          })
        }
      } catch {
        if (!cancelled) {
          setError(
            'Could not load dashboard data. Please check your API connection.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const openClaims = data.claims.filter(
    (item) =>
      !['approved', 'rejected', 'closed'].includes(
        normalizeStatus(item.status),
      ),
  ).length

  const pendingVerification = data.verifications.filter((item) =>
    ['pending', 'under review', 'submitted'].includes(
      normalizeStatus(item.status),
    ),
  ).length

  const approvedClaims = data.claims.filter(
    (item) => normalizeStatus(item.status) === 'approved',
  ).length

  const completedHandovers = data.handovers.filter((item) =>
    ['handed over', 'closed', 'completed'].includes(
      normalizeStatus(item.status),
    ),
  ).length

  const cards =
    user?.role === 'admin'
      ? [
          { label: 'Lost Reports', value: data.lostReports.length },
          { label: 'Found Items', value: data.foundItems.length },
          { label: 'Open Claims', value: openClaims },
          { label: 'Pending Verification', value: pendingVerification },
          { label: 'Approved Claims', value: approvedClaims },
          { label: 'Completed Handovers', value: completedHandovers },
        ]
      : user?.role === 'staff'
        ? [
            { label: 'Lost Reports', value: data.lostReports.length },
            { label: 'Found Items', value: data.foundItems.length },
            { label: 'Open Claims', value: openClaims },
            { label: 'Pending Verification', value: pendingVerification },
            { label: 'Completed Handovers', value: completedHandovers },
          ]
        : [
            { label: 'Lost Reports', value: data.lostReports.length },
            { label: 'Found Items', value: data.foundItems.length },
            {
              label: 'My Claims',
              value: data.claims.filter((item) => item.userId === user?.id).length,
            },
          ]

  const itemTypeData = [
    { name: 'Lost reports', value: data.lostReports.length },
    { name: 'Found items', value: data.foundItems.length },
  ]

  const workflowData = [
    { name: 'Open claims', count: openClaims },
    { name: 'Pending verification', count: pendingVerification },
    { name: 'Approved claims', count: approvedClaims },
    { name: 'Completed handovers', count: completedHandovers },
  ]

  const lostStatusData = countStatuses(data.lostReports)
  const foundStatusData = countStatuses(data.foundItems)

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-teal-600 dark:text-teal-400">
          FINDORA OVERVIEW
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Welcome, {user?.name ?? 'User'}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Track reports, claims, verification, and item recovery progress.
        </p>
      </div>

      {loading && (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading dashboard data…
        </p>
      )}

      {!loading && error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
              <article
                key={card.label}
                className="rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                style={{
                  borderLeftColor: chartColors[index % chartColors.length],
                }}
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ChartCard
              title="Lost and Found Items"
              subtitle="Report volume comparison"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={itemTypeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {itemTypeData.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Recovery Workflow"
              subtitle="Current records by stage"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workflowData}
                  margin={{ top: 10, right: 10, left: -18, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--chart-text)', fontSize: 11 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={55}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'var(--chart-text)', fontSize: 11 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="count"
                    name="Records"
                    fill="#0d9488"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Lost Report Status"
              subtitle="Count of reports by status"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lostStatusData}
                  margin={{ top: 10, right: 10, left: -18, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                  />
                  <XAxis
                    dataKey="status"
                    tick={{ fill: 'var(--chart-text)', fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'var(--chart-text)', fontSize: 11 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="count"
                    name="Reports"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Found Item Status"
              subtitle="Count of found items by status"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={foundStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {foundStatusData.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </section>
  )
}

const tooltipStyle = {
  backgroundColor: 'var(--chart-tooltip)',
  border: '1px solid var(--chart-grid)',
  borderRadius: '10px',
  color: 'var(--chart-text)',
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <div
        className="h-64 w-full"
        style={
          {
            '--chart-grid': 'var(--chart-grid-color)',
            '--chart-text': 'var(--chart-text-color)',
            '--chart-tooltip': 'var(--chart-tooltip-color)',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </section>
  )
}
