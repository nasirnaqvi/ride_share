import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function RedirectIfSignedIn({ signedIn, children }) {
    const location = useLocation();
    
    // Save the current URL before redirecting
    useEffect(() => {
        if (!signedIn) {
            sessionStorage.setItem('redirectUrl', location.pathname);
        }
    }, [signedIn, location.pathname]);

    if (signedIn) {
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
        sessionStorage.removeItem('redirectUrl'); // Clear the redirect URL after using it
        return <Navigate to={redirectUrl} replace />;
    }
    
    return children;
}
