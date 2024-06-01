import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    signedIn: boolean,
    children: ReactNode
}

export default function ProtectedRoute({signedIn, children}: ProtectedRouteProps) {
    if (!signedIn) {
        return (
            <Navigate to="/login" replace/>
        )
    }
    return children
}