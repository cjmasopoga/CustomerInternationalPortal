import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './firebase/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Payment from './components/Payment'
import TransactionHistory from './components/TransactionHistory'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      {/* /register is intentionally removed — employee accounts are created by admin only */}
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App