import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingsProvider } from './context/BookingsContext';
import { ToastProvider } from './components/UI';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import FundiDashboard from './pages/FundiDashboard';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingsProvider>
          <ToastProvider>
            <div style={{ minHeight: '100vh' }}>
              <Navbar />
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/browse"         element={<Browse />} />
                <Route path="/register"       element={<Register />} />
                <Route path="/login"          element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard"  element={
                  <ProtectedRoute role="fundi"><FundiDashboard /></ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
                } />
              </Routes>
            </div>
          </ToastProvider>
        </BookingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
