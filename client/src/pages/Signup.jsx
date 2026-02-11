import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });
    const [isLoading, setIsLoading] = useState(false);

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

            <div className="w-full max-w-xl relative z-10">
                <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl shadow-slate-200/50">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-16 h-16 bg-violet-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-violet-500/30 -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer" onClick={() => navigate("/")}>
                            <span className="font-black text-3xl text-white">S</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Request Access</h2>
                        <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Initialize New Operator Profile</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300"
                                    placeholder="Enter your full identifier..."
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal ID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300"
                                    placeholder="Minimum 6 characters..."
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-violet-500/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        Generate Profile <ShieldCheck size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Already an operator? <Link to="/login" className="text-violet-600 hover:text-violet-700 ml-2">Authenticate Access</Link>
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