import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <span className="font-bold text-2xl tracking-tight hover:text-indigo-100 transition duration-300">
                            Slot<span className="text-yellow-300">X</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium">Hello, {user.name}</span>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="px-4 py-2 rounded-md font-medium bg-indigo-500 hover:bg-indigo-400 transition duration-300 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-md font-medium border border-indigo-400 hover:bg-indigo-500 transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <button className="px-5 py-2 rounded-md font-medium hover:bg-indigo-500 transition duration-300">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="px-5 py-2 rounded-md font-medium bg-white text-indigo-600 hover:bg-gray-100 transition duration-300 shadow-sm">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-indigo-700 pb-4">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-base font-medium">Hello, {user.name}</div>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-3 py-2 rounded-md text-base font-medium bg-white text-indigo-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;