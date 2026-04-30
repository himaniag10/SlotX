import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, User, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from "../../utils/api";

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "student"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signup(formData);
            toast.success("Identity Registered.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 opacity-60"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-2xl shadow-slate-200/50">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-violet-500/30 -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer" onClick={() => navigate("/")}>
                            <span className="font-black text-2xl text-white">S</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Initialize Profile</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Create New Identity</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                    placeholder="Enter your full identifier..."
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-violet-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        Generate Profile <ShieldCheck size={18} />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or Secure via</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.location.href = `${API_BASE}/api/auth/google`}
                            className="w-full py-4 bg-white border border-slate-200 hover:border-violet-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.67l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google Sync
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Already registered? <Link to="/login" className="text-violet-600 hover:text-violet-700 ml-2">Authenticate Access</Link>
                        </p>
                    </div>
                </div>

                <p className="mt-10 text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
                    Slot<span className="text-violet-500">X</span> Protocol • Alpha Interface
                </p>
            </div>
        </div>
    );
};

export default Signup;
