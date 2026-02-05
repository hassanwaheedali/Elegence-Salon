import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner />
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute
