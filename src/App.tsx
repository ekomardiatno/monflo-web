import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { loadUserThunk } from '@/store/slices/authSlice'
import { fetchActivitiesThunk } from '@/store/slices/activitySlice'
import { fetchSettingsThunk } from '@/store/slices/appSlice'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'
import HomePage from './pages/HomePage'
import ActivityFormPage from './pages/ActivityFormPage'
import StatisticsPage from './pages/StatisticsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import AllocationPage from './pages/AllocationPage'
import AllocationPerCategoryPage from './pages/AllocationPerCategoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SetPasswordPage from './pages/SetPasswordPage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      dispatch(loadUserThunk())
        .unwrap()
        .then(() => {
          dispatch(fetchActivitiesThunk())
          dispatch(fetchSettingsThunk())
        })
        .catch(() => {})
    }
  }, [dispatch])

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/activity/new/:type" element={<ActivityFormPage />} />
          <Route path="/activity/:id/edit" element={<ActivityFormPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/history/:dateView" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/allocation/:dateView/:type" element={<AllocationPage />} />
          <Route path="/allocation/:dateView/:type/:category" element={<AllocationPerCategoryPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
