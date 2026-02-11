import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar, Shield, Zap, UserCheck, ArrowRight, Users, Sparkles, Globe, Cpu } from "lucide-react";

const Landing = () => {
    const { user } = useAuth();

    const features = [
        {
            icon: <Calendar className="w-8 h-8 text-violet-600" />,
            title: "Seamless Booking",
            description: "Allocate preferred slots in seconds with our high-speed coordination unit."
        },
        {
            icon: <Shield className="w-8 h-8 text-teal-600" />,
            title: "Secure & Reliable",
            description: "Encrypted data streams with zero contention guarantee for every booking."
        },
        {
            icon: <Zap className="w-8 h-8 text-violet-500" />,
            title: "Real-time Sync",
            description: "Instantaneous heartbeat updates for all deployment windows."
        },
        {
            icon: <UserCheck className="w-8 h-8 text-violet-600" />,
            title: "Central Control",
            description: "High-level dashboards for students and admins to maintain order."
        }
    ];

    const stats = [
        { label: "Active Units", value: "12k+", icon: <Users size={20} className="text-violet-600" /> },
        { label: "Slots Allocated", value: "85k+", icon: <Calendar size={20} className="text-teal-600" /> },
        { label: "System Uptime", value: "99.9%", icon: <Cpu size={20} className="text-rose-500" /> },
        { label: "Global Sync", value: "100%", icon: <Globe size={20} className="text-violet-500" /> }
    ];

    return (
        <div className="bg-slate-50 text-slate-900 overflow-hidden min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative pt-32 pb-40 overflow-hidden">
                {/* Ambient Background Glows */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-200/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

                <div className="w-full px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full mb-10 shadow-sm transition-transform hover:scale-105 cursor-default">
                        <Sparkles className="text-violet-600" size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600">Aura Light v5.0 Active</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 text-slate-900">
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">Infrastructure.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 mb-16 font-medium leading-relaxed">
                        SlotX is the premium coordination engine for academic allocation. <br className="hidden md:block" /> Fast, minimalist, and architected for precision.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        {user ? (
                            <Link to="/dashboard" className="px-10 py-5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl shadow-violet-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                                Access Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-10 py-5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-xl shadow-2xl shadow-violet-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                                    Initialize Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="px-10 py-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-[0.3em] rounded-xl transition-all shadow-sm active:scale-95">
                                    Terminal Auth
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-24 border-y border-slate-100 shadow-sm relative z-20">
                <div className="w-full px-6 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-40 bg-slate-50 relative overflow-hidden">
                <div className="w-full px-6 lg:px-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-6xl font-black text-slate-900 mb-8 tracking-tighter">Engine Specs.</h2>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                Engineered for high-concurrency environments requiring absolute precision in slot management and real-time state synchronization.
                            </p>
                        </div>
                        <div className="pb-2">
                            <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 shadow-sm">
                                System Status: Optimal
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-10 bg-white border border-slate-200 hover:border-violet-300 rounded-3xl transition-all group shadow-sm hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                                <div className="mb-8 group-hover:scale-110 transition-transform inline-flex p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-[1400px] mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                            Core Online. <br /> Systems Ready.
                        </h2>
                        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                            Join the global network and coordinate your academic schedule with the most advanced orchestration terminal in education.
                        </p>
                        <Link to={user ? "/dashboard" : "/signup"} className="inline-flex px-12 py-6 bg-white text-slate-950 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-2xl text-[10px] uppercase tracking-[0.4em]">
                            {user ? "Execute Dashboard" : "Register Credentials"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Decorative Logo */}
            <div className="py-20 text-center opacity-20 pointer-events-none mb-10">
                <span className="text-8xl md:text-[12rem] font-black text-slate-300 select-none tracking-tighter">SLOTX</span>
            </div>
        </div>
    );
};

export default Landing;