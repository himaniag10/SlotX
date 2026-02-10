import React from 'react';
import { Calendar, BookOpen, Clock, CheckCircle2, Search, ArrowRight } from 'lucide-react';

const UserDashboard = ({ user }) => {
    const activities = [
        { type: 'Booking', title: 'Calculus Slot Booked', time: '2 hours ago', status: 'success' },
        { type: 'Update', title: 'New Physics slots available', time: '5 hours ago', status: 'info' },
        { type: 'Reminder', title: 'Upload ID for Midterm', time: 'Yesterday', status: 'warning' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>
                    <p className="text-gray-500">How's it going, {user?.name}? Ready to book a slot?</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors shadow-sm">
                    <Calendar size={18} />
                    Book New Slot
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for available exam slots..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">My Bookings</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { exam: 'Computer Networks', date: 'Oct 30, 2023', time: '10:00 AM', room: 'Lab 4' },
                                { exam: 'Software Engineering', date: 'Nov 02, 2023', time: '02:30 PM', room: 'Hall B' },
                            ].map((booking, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                                    <div className="flex gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center min-w-[60px]">
                                            <span className="block text-xs font-medium text-gray-400 uppercase">{booking.date.split(' ')[0]}</span>
                                            <span className="block text-xl font-bold text-gray-800">{booking.date.split(' ')[1].replace(',', '')}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{booking.exam}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {booking.time}</span>
                                                <span className="flex items-center gap-1"><BookOpen size={14} /> {booking.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                                View All Booking History
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Activity</h3>
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                            {activities.map((activity, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    <div className={`mt-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${activity.status === 'success' ? 'bg-green-50 text-green-600' :
                                        activity.status === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-100">
                        <h4 className="font-bold text-lg mb-2">Need help?</h4>
                        <p className="text-indigo-100 text-sm mb-4">Check out our guide on how to book and manage your exam slots efficiently.</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors border border-white/20">
                            Read Documentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;