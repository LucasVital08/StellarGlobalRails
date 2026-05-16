import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function AuthGuard() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
