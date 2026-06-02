import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: theme.backgroundBasicColor1 }}
      >
        <div
          className="w-8 h-8 border-3 rounded-full animate-spin"
          style={{
            borderColor: theme.backgroundBasicColor3,
            borderTopColor: COLORS.colorPrimary500,
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user && !user.hasPassword && location.pathname !== '/set-password') {
    return <Navigate to="/set-password" replace />;
  }

  return <Outlet />;
}
