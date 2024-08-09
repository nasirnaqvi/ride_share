import { Navigate } from 'react-router-dom';

export default function RedirectIfSignedIn({signedIn, children}) {
    if (signedIn) {
        return (
            <Navigate to="/" replace/>
        )
    }
    return children
}