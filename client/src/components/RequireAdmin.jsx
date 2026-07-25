import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RequireAdmin({ children }) {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.role !== 'admin')) {
      toast.error('Access denied. Administrator privileges required.');
    }
  }, [isLoggedIn, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Verifying admin permissions...</p>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
