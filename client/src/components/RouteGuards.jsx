import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing...</p>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
        </div>;
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export const TeacherRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
        </div>;
    }

    if (!user || user.role !== "teacher") {
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
