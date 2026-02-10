import { Link } from "react-router-dom";
import { PublicRoute } from "../components/RouteGuards";

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-5xl font-bold text-indigo-600 mb-4">Welcome to SlotX</h1>
            <p className="text-xl text-gray-600 mb-8">Your ultimate slot booking solution for students.</p>
            <div className="space-x-4">
                <PublicRoute>
                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/signup"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                        >
                            Get Started
                        </Link>
                    </div>
                </PublicRoute>
            </div>
        </div>
    );
};

export default Landing;
