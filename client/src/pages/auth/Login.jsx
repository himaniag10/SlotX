import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
            await login(formData);
            toast.success("Identity Verified.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 opacity-60"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-2xl shadow-slate-200/50">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-violet-500/30 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer" onClick={() => navigate("/")}>
                            <span className="font-black text-2xl text-white">S</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Initialize Session</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Access Secure Node</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Universal ID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                    placeholder="Enter your registered email..."
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                    placeholder="Enter secure pattern..."
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-violet-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-violet-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    Establish Link <ShieldCheck size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            New operator? <Link to="/signup" className="text-violet-600 hover:text-violet-700 ml-2">Request Credentials</Link>
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

export default Login;
