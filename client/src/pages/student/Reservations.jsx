import React from "react";
import UserDashboard from "../../components/UserDashboard";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const UserReservationsPage = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen py-8 bg-slate-50">
            <div className="w-full px-6 lg:px-12 mb-6">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-violet-600 transition-colors">
                    <ChevronLeft size={16} />
                    Back to Portal
                </Link>
            </div>
            <UserDashboard user={user} fullView={true} />
        </div>
    );
};

export default UserReservationsPage;
