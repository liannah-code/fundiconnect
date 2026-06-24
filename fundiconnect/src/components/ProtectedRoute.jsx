import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './UI';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    const fallback = user.role === 'admin' ? '/admin' : user.role === 'fundi' ? '/dashboard' : '/my-bookings';
    return <Navigate to={fallback} replace />;
  }
  return children;
}
