import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Public Route Component (redirects to dashboard if already logged in)
export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};
