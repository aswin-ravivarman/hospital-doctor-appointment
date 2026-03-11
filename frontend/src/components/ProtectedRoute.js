import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export const PublicRoute = () => {
    const { user } = useAuth();

    if (user) {
        // Redirect based on role
        if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'ROLE_DOCTOR') return <Navigate to="/doctor" replace />;
        return <Navigate to="/patient" replace />;
    }

    return <Outlet />;
};
