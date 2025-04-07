import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Paper } from '@mui/material'
import BottomNavigation from './components/layout/BottomNavigation'
import MessageTab from './components/tabs/MessageTab'
import ActivityTab from './components/tabs/ActivityTab'
import AnalysisTab from './components/tabs/AnalysisTab'
import SettingsTab from './components/tabs/SettingsTab'

// Auth & Device Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DeviceList from './pages/devices/DeviceList'
import AddDevice from './pages/devices/AddDevice'
import DeviceDashboard from './pages/devices/DeviceDashboard'

// Auth Context
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated } = useAuth()

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    return children
  }

  // Device Dashboard Layout
  const DashboardLayout = () => (
    <Box className="app-container">
      <Box className="content-area">
        <Routes>
          <Route path="/" element={<MessageTab />} />
          <Route path="/activity" element={<ActivityTab />} />
          <Route path="/analysis" element={<AnalysisTab />} />
          <Route path="/settings" element={<SettingsTab />} />
        </Routes>
      </Box>
      <Paper className="bottom-nav" elevation={3}>
        <BottomNavigation />
      </Paper>
    </Box>
  )

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/devices" element={
        <ProtectedRoute>
          <DeviceList />
        </ProtectedRoute>
      } />
      
      <Route path="/devices/add" element={
        <ProtectedRoute>
          <AddDevice />
        </ProtectedRoute>
      } />

      {/* Device Dashboard - Using existing tabs */}
      <Route path="/devices/:imei/*" element={
        <ProtectedRoute>
          <DeviceDashboard>
            <DashboardLayout />
          </DeviceDashboard>
        </ProtectedRoute>
      } />

      {/* Redirect root to devices list or login */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/devices" /> : <Navigate to="/login" />
      } />
    </Routes>
  )
}

export default App 