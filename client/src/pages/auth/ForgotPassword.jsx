import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Mail, Lock, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { authApi, getErrorMessage } from "../../utils/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authApi.forgotPassword(email);
            toast.success("Recovery code sent to your email.");
            setStep(2);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setIsLoading(true);
        try {
            await authApi.resetPassword({
                email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            toast.success("Identity re-initialized successfully.");
            navigate("/login");
        } catch (error) {
            toast.error(getErrorMessage(error));
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
                        <Link to="/login" className="self-start mb-8 text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                        <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-violet-500/30">
                            <KeyRound className="text-white" size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Recover Access</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                            {step === 1 ? "Initialize Identity Lookup" : "Confirm Security Protocol"}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-8">
                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Universal ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                        placeholder="Enter registered email..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-violet-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        Send Recovery Code <ShieldCheck size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetSubmit} className="space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Recovery Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-black text-center tracking-[0.5em] text-xl"
                                    placeholder="000000"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Pattern</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                        placeholder="Minimum 6 characters..."
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Pattern</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-300 text-sm"
                                        placeholder="Repeat new pattern..."
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-violet-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        Update Identity <ShieldCheck size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
