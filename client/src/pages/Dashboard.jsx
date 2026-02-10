import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold text-gray-700">Welcome to SlotX Dashboard</h1>
                    {user && <p className="mt-4 text-lg text-gray-500">Hello, {user.name}!</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
