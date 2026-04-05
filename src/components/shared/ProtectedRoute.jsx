import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * Saves the attempted URL so we can redirect back after login.
 */
export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuth()
    const location = useLocation()

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}