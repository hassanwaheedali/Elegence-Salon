import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, currentUser } = useAuth();

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole) {
        const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const role = currentUser?.role;
        if (!role || !allowed.includes(role)) {
            return <Navigate to="/login" replace />;
        }
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute
