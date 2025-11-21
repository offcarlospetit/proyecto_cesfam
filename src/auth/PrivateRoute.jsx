// src/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="p-4">Cargando…</div>;
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}
