import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
    Calendar,
    Shield,
    Zap,
    UserCheck,
    ArrowRight,
    CheckCircle2,
    Users
} from "lucide-react";

const Landing = () => {
    const { user } = useAuth();
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const features = [
        {
            icon: <Calendar className="w-8 h-8 text-indigo-500" />,
            title: "Seamless Booking",
            description: "Book your preferred exam slots in seconds with our intuitive interface."
        },
        {
            icon: <Shield className="w-8 h-8 text-green-500" />,
            title: "Secure & Reliable",
            description: "Your data is encrypted and secure. We ensure zero double-bookings."
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            title: "Real-time Updates",
            description: "Get instant notifications for new slots and booking confirmations."
        },
        {
            icon: <UserCheck className="w-8 h-8 text-purple-500" />,
            title: "Role-based Access",
            description: "Dedicated dashboards for students and admins to manage tasks efficiently."
        }
    ];

    const stats = [
        { label: "Active Students", value: "10k+", icon: <Users size={20} /> },
        { label: "Slots Booked", value: "50k+", icon: <Calendar size={20} /> },
        { label: "Uptime", value: "99.9%", icon: <Zap size={20} /> },
        { label: "Success Rate", value: "100%", icon: <CheckCircle2 size={20} /> }
    ];

    return (
        <div className="bg-white overflow-hidden">
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                            Master Your Schedule with <br />
                            <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                SlotX
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
                            The intelligent slot booking platform designed specifically for students and educational institutions. Effortless, efficient, and elegant.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                                    >
                                        Get Started Free
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-100 text-lg font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all hover:border-indigo-100"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px]" />
                </div>
            </section>

            <section className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="flex items-center justify-center text-indigo-600 mb-2">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            SlotX provides all the tools necessary for an optimal booking experience.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50/50 group"
                            >
                                <div className="p-3 bg-gray-50 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Ready to simplify your scheduling?
                            </h2>
                            <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Join thousands of students who are already using SlotX to manage their academic life.
                            </p>
                            <Link
                                to={user ? "/dashboard" : "/signup"}
                                className="inline-flex items-center justify-center px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                            >
                                {user ? "Manage Your Dashboard" : "Create Your Account Now"}
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-indigo-500/50 rounded-full blur-3xl" />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Landing;