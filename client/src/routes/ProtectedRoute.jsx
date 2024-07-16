import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


export default function ProtectedRoute({signedIn, children}) {
    if (!signedIn) {
        return (
            <Navigate to="/login" replace/>
        )
    }
    return children
}