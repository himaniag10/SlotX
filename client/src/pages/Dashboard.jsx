import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50/50">
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
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