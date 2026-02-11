import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { LogOut, Shield, Menu, X as CloseIcon, Users, FileText, LayoutDashboard, CalendarCheck, Zap, History } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
            <div className="w-full px-6 lg:px-12">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-violet-500/20">
                            <span className="font-black text-xl text-white">S</span>
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-slate-900">
                            Slot<span className="text-violet-600">X</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">{user.name}</span>
                                </div>

                                {user.role === "admin" ? (
                                    <>
                                        <button
                                            onClick={() => navigate("/admin")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <Shield size={14} />
                                            Panel
                                        </button>
                                        <button
                                            onClick={() => navigate("/admin/registry")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <Users size={14} />
                                            Registry
                                        </button>
                                        <button
                                            onClick={() => navigate("/admin/logs")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <FileText size={14} />
                                            Logs
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate("/dashboard")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <LayoutDashboard size={14} />
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => navigate("/dashboard/reservations")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <CalendarCheck size={14} />
                                            Reservations
                                        </button>
                                        <button
                                            onClick={() => navigate("/dashboard/active")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <Zap size={14} />
                                            Active
                                        </button>
                                        <button
                                            onClick={() => navigate("/dashboard/activity")}
                                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2"
                                        >
                                            <History size={14} />
                                            Activity
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Exit
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-violet-600">
                                    Login
                                </Link>
                                <Link to="/signup" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-500/20 transition-all">
                                    Initialize
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-900"
                        >
                            {isMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 py-6">
                    <div className="px-4 space-y-4">
                        {user ? (
                            <>
                                <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-black text-violet-600 uppercase tracking-widest">
                                    {user.name}
                                </div>
                                {user.role === "admin" ? (
                                    <>
                                        <Link to="/admin" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Panel
                                        </Link>
                                        <Link to="/admin/registry" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Registry
                                        </Link>
                                        <Link to="/admin/logs" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Logs
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/dashboard" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Dashboard
                                        </Link>
                                        <Link to="/dashboard/reservations" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Reservations
                                        </Link>
                                        <Link to="/dashboard/active" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Active
                                        </Link>
                                        <Link to="/dashboard/activity" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                            Activity
                                        </Link>
                                    </>
                                )}
                                <button onClick={handleLogout} className="w-full text-left px-4 py-4 bg-rose-500/10 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                                    Exit Terminal
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link to="/signup" className="block px-4 py-4 bg-violet-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest text-center" onClick={() => setIsMenuOpen(false)}>
                                    Initialize
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
