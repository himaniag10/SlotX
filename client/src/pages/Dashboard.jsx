import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="w-full">
                {user?.role === "admin" ? (
                    <AdminDashboard user={user} />
                ) : (
                    <UserDashboard user={user} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;