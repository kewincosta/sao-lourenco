import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth.store';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
