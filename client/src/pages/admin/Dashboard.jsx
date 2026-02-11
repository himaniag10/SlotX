import React from "react";
import AdminDashboard from "../../components/AdminDashboard";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboardPage = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50/50">
            <AdminDashboard user={user} />
        </div>
    );
};

export default AdminDashboardPage;
