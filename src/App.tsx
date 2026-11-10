import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import LockScreenPage from './pages/auth/LockScreenPage'
import NotFoundPage from './pages/others/NotFoundPage'

import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/dashboard/DashboardPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import LostReportsPage from './pages/lost-reports/LostReportsPage'
import FoundItemsPage from './pages/found-items/FoundItemsPage'
import ClaimsPage from './pages/claims/ClaimsPage'
import UsersPage from './pages/users/UsersPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import ReportsPage from './pages/reports/ReportsPage'
import ActivityLogsPage from './pages/activity-logs/ActivityLogsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import UserReportsPage from './pages/user/UserReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/lock-screen" element={<LockScreenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/lost-reports" element={<LostReportsPage />} />
            <Route path="/found-items" element={<FoundItemsPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/report-item" element={<UserReportsPage />} />

          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App