
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Fast-track: If storage exists but state is updating, don't show full page loader if possible
  // This allows the app to feel snappy
  const hasLocalToken = !!localStorage.getItem('noor_token');

  if (loading && !hasLocalToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Syncing Hub...</p>
      </div>
    );
  }

  if (!user && !hasLocalToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Final role verification
  if (requiredRole && user && user.role !== requiredRole) {
    const fallback = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
