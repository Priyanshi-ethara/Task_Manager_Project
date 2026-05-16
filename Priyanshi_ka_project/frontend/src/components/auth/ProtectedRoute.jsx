import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FullScreenLoader = () => (
  <div className="h-screen flex items-center justify-center bg-ink-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-2xl bg-brand-gradient blur-xl opacity-50 animate-pulse-soft" />
        <div className="relative w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-xl shadow-glow">
          S
        </div>
      </div>
      <div className="text-sm text-ink-500">Loading workspace…</div>
    </div>
  </div>
);

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
