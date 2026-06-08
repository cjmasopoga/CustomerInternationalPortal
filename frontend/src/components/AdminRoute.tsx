import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { useAdmin } from '../hooks/useAdmin';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { currentUser } = useAuth();
  const { isAdmin, loading } = useAdmin();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
