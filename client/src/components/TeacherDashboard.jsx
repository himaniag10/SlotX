import React, { useState, useEffect } from "react";
import { adminApi, getErrorMessage } from "../utils/api";
import { Calendar, Clock, Plus, Loader2, ListChecks, Trash2, Edit3, X, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
            </div>
            <div className={`${bg} ${color} p-3 rounded-xl bg-opacity-10`}>
                <Icon size={20} />
            </div>
        </div>
    </div>
);

const TeacherDashboard = ({ user }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editingSlot, setEditingSlot] = useState(null);
    const [form, setForm] = useState({
        examName: "",
        date: "",
        startTime: "",
        endTime: "",
        maxCapacity: "1",
        slotDuration: "30",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getSlots();
            setSlots(res.data);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createSlot(form);
            setForm({ examName: "", date: "", startTime: "", endTime: "", maxCapacity: "1", slotDuration: "30" });
            fetchData();
            toast.success("Window initialized successfully!");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await adminApi.toggleSlot(id);
            fetchData();
            toast.success("State synchronized");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Are you sure? This will purge the slot.")) return;
        try {
            await adminApi.deleteSlot(id);
            fetchData();
            toast.success("Window purged");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleRemoveStudent = async (bookingId) => {
        if (!window.confirm("Revoke student access?")) return;
        try {
            await adminApi.removeBooking(bookingId);
            toast.success("Access revoked");
            fetchData();
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-violet-600 mb-2" size={24} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Teacher Portal...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 w-full px-6 lg:px-12 py-10 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">Instructor <span className="text-violet-600">Portal.</span></h2>
                    <p className="text-slate-500 mt-1.5 font-bold uppercase tracking-widest text-xs">Manage your allocated sessions • {user?.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StatCard label="Your Active Windows" value={slots.length} icon={Calendar} color="text-violet-600" bg="bg-violet-500" />
                <StatCard label="Total Students" value={slots.reduce((acc, s) => acc + (s.bookings?.length || 0), 0)} icon={UserCheck} color="text-teal-600" bg="bg-teal-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Plus className="text-violet-600" size={20} />
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Window</h3>
                        </div>
                        <form onSubmit={handleCreateSlot} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Exam Name</label>
                                <input type="text" value={form.examName} onChange={(e) => setForm({ ...form, examName: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-violet-600 transition-all" placeholder="e.g. Lab Viva" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-violet-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Start</label>
                                    <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-violet-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">End</label>
                                    <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-violet-600" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-500/10 text-xs uppercase tracking-widest">
                                Deploy Window
                            </button>
                        </form>
                    </section>
                </div>

                <div className="lg:col-span-2">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <ListChecks className="text-violet-600" size={20} />
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Registry</h3>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Session</th>
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {slots.map((slot) => (
                                            <React.Fragment key={slot._id}>
                                                <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedSlot(selectedSlot === slot._id ? null : slot._id)}>
                                                    <td className="px-8 py-5">
                                                        <p className="font-bold text-slate-900">{slot.examName}</p>
                                                        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mt-0.5">{slot.startTime} - {slot.endTime} • {new Date(slot.date).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${slot.remainingCapacity === 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-teal-500/10 text-teal-600'}`}>
                                                            {slot.maxCapacity - slot.remainingCapacity} / {slot.maxCapacity} Booked
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-slate-400">
                                                        <div className="flex gap-4">
                                                            <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(slot._id) }} className="hover:text-amber-500 transition-colors"><Clock size={16} /></button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot._id) }} className="hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {selectedSlot === slot._id && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="3" className="px-8 py-4">
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Enrolled Students</p>
                                                                {slot.bookings?.length > 0 ? slot.bookings.map(booking => (
                                                                    <div key={booking.bookingId} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                                                        <div>
                                                                            <p className="text-sm font-bold text-slate-900">{booking.studentName}</p>
                                                                            <p className="text-[10px] text-slate-400">{booking.studentEmail}</p>
                                                                        </div>
                                                                        <button onClick={() => handleRemoveStudent(booking.bookingId)} className="text-[10px] font-bold text-rose-600 uppercase hover:underline">Revoke</button>
                                                                    </div>
                                                                )) : <p className="text-xs text-slate-400 italic">No students enrolled yet.</p>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
