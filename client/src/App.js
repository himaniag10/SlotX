import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Toaster position="top-right" />
                    <Navbar />
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    <PublicRoute>
                                        <Signup />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;