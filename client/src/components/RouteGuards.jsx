import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

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