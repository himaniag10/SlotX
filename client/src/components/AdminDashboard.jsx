import React from 'react';
import { Users, Calendar, Clock, BarChart3, Plus, Settings } from 'lucide-react';

const AdminDashboard = ({ user }) => {
    const stats = [
        { label: 'Total Students', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Active Slots', value: '42', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pending Bookings', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'System Health', value: '98%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Admin Overview</h2>
                    <p className="text-gray-500">Welcome back, {user?.name}. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Settings size={18} />
                        Settings
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus size={18} />
                        Create Slot
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 font-medium text-gray-500">Student</th>
                                    <th className="pb-3 font-medium text-gray-500">Exam</th>
                                    <th className="pb-3 font-medium text-gray-500">Date</th>
                                    <th className="pb-3 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { name: 'John Doe', exam: 'Midterm Physics', date: 'Oct 24, 2023', status: 'Confirmed' },
                                    { name: 'Jane Smith', exam: 'Calculus Final', date: 'Oct 25, 2023', status: 'Pending' },
                                    { name: 'Alice Wong', exam: 'Organic Chem', date: 'Oct 26, 2023', status: 'Confirmed' },
                                ].map((booking, i) => (
                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 font-medium text-gray-800">{booking.name}</td>
                                        <td className="py-4 text-gray-600">{booking.exam}</td>
                                        <td className="py-4 text-gray-500">{booking.date}</td>
                                        <td className="py-4 text-gray-500">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Tasks</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-md">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Review New Signups</p>
                                <p className="text-xs text-gray-500">5 pending approvals</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                            <div className="bg-rose-100 text-rose-600 p-2 rounded-md">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Manage Exam Dates</p>
                                <p className="text-xs text-gray-500">Update upcoming schedule</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;