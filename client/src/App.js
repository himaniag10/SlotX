import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, PublicRoute, AdminRoute } from "./components/RouteGuards";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Landing from "./pages/common/Landing";
import AdminRegistry from "./pages/admin/Registry";
import AdminLogs from "./pages/admin/Logs";
import UserReservations from "./pages/student/Reservations";
import UserActiveReservations from "./pages/student/ActiveReservations";
import UserActivity from "./pages/student/Activity";

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
                    <Toaster position="bottom-right" />
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
                            <Route
                                path="/dashboard/reservations"
                                element={
                                    <ProtectedRoute>
                                        <UserReservations />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/active"
                                element={
                                    <ProtectedRoute>
                                        <UserActiveReservations />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/activity"
                                element={
                                    <ProtectedRoute>
                                        <UserActivity />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/registry"
                                element={
                                    <AdminRoute>
                                        <AdminRegistry />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/logs"
                                element={
                                    <AdminRoute>
                                        <AdminLogs />
                                    </AdminRoute>
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