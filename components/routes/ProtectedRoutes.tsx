
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

  // Redundant Check: Use localStorage if state is temporarily null
  const token = localStorage.getItem('noor_token');
  const cachedUserStr = localStorage.getItem('noor_user');
  let cachedUser = null;
  
  if (cachedUserStr) {
    try {
      cachedUser = JSON.parse(cachedUserStr);
    } catch (e) {
      localStorage.clear();
    }
  }

  const activeUser = user || cachedUser;
  const isAuthenticated = !!token && !!activeUser;

  // Show nothing or loader while checking initial auth
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Authenticating Node...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role Validation
  if (requiredRole && activeUser.role !== requiredRole) {
    const fallbackPath = activeUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
