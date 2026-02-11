import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi, getErrorMessage } from "../utils/api";
import { Users, Calendar, Clock, BarChart3, Plus, Settings, Loader2, ListChecks, History, ShieldAlert, Trash2, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
            </div>
            <div className={`${bg.replace('bg-', 'bg-')}/10 ${color.replace('text-', 'text-')} p-4 rounded-2xl`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const AdminDashboard = ({ user, fullRegistry = false, fullLogs = false }) => {
    const [slots, setSlots] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 0, activeSlots: 0, totalBookings: 0, failedAttempts: 0 });
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
            const [slotsRes, logsRes, statsRes] = await Promise.all([
                adminApi.getSlots(),
                adminApi.getAuditLogs(),
                adminApi.getStats()
            ]);
            setSlots(slotsRes.data);
            setAuditLogs(logsRes.data);
            setStats(statsRes.data);
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
            const res = await adminApi.createSlot(form);
            setForm({ examName: "", date: "", startTime: "", endTime: "", maxCapacity: "1", slotDuration: "30" });
            fetchData();
            toast.success(res.message || "Environment initialized");
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
        if (!window.confirm("CRITICAL: Deleting this window will purge all associated bookings. Continue?")) return;
        try {
            await adminApi.deleteSlot(id);
            fetchData();
            toast.success("Window purged");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleUpdateSlot = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateSlot(editingSlot._id, editingSlot);
            setEditingSlot(null);
            fetchData();
            toast.success("Manifest updated");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleRemoveStudent = async (bookingId) => {
        if (!window.confirm("CRITICAL: This will immediately revoke student access and free the spot. Continue?")) return;
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
                <Loader2 className="animate-spin text-violet-600 mb-2" size={32} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Secure Boot in Progress...</p>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Entities', value: stats.totalStudents, icon: Users, color: 'text-violet-600', bg: 'bg-violet-500' },
        { label: 'Active Windows', value: stats.activeSlots, icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-500' },
        { label: 'Secured Spots', value: stats.totalBookings, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500' },
        { label: 'Alerts', value: stats.failedAttempts, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-500' },
    ];

    const DeploymentForm = () => (
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Plus className="text-violet-600" size={24} />
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Init Window</h3>
                </div>
                <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Label</label>
                        <input type="text" value={form.examName} onChange={(e) => setForm({ ...form, examName: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold placeholder-slate-400" placeholder="e.g. Finals 2026" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
                        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Window Start</label>
                            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Window End</label>
                            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Dur. (m)</label>
                        <input type="number" value={form.slotDuration} onChange={(e) => setForm({ ...form, slotDuration: e.target.value })} required min="1" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-violet-600 transition-all font-bold" />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="w-full py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-violet-500/20 active:scale-95 text-[10px] uppercase tracking-widest">
                            Initialize Deployment
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );

    const RegistryTable = () => (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <ListChecks className="text-violet-600" size={24} />
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Unit Registry</h3>
                </div>
                {!fullRegistry && (
                    <Link to="/admin/registry" className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:text-slate-900 transition-colors">
                        Full Manifest
                    </Link>
                )}
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation & Date</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacitance</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Command</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Object.values(slots.reduce((acc, slot) => {
                                const key = `${slot.examName}_${new Date(slot.date).toISOString().split('T')[0]}`;
                                if (!acc[key]) acc[key] = { id: key, name: slot.examName, date: slot.date, slots: [], total: 0, rem: 0 };
                                acc[key].slots.push(slot);
                                acc[key].total += slot.maxCapacity;
                                acc[key].rem += slot.remainingCapacity;
                                return acc;
                            }, {})).slice(0, fullRegistry ? undefined : 3).map((group) => (
                                <React.Fragment key={group.id}>
                                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="font-black text-slate-900 text-lg">{group.name}</p>
                                            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-1">{new Date(group.date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-10 py-6"><p className="text-xs font-black text-slate-400">{group.slots.length} Units • {group.total - group.rem} / {group.total} Locked</p></td>
                                        <td className="px-10 py-6">
                                            <button onClick={() => setSelectedSlot(selectedSlot?._id === group.slots[0]._id ? null : group.slots[0])} className="text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-slate-900 transition-colors">
                                                {selectedSlot?._id === group.slots[0]._id ? 'Collapse' : 'Inspect'}
                                            </button>
                                        </td>
                                    </tr>
                                    {selectedSlot?._id === group.slots[0]._id && group.slots.map(slot => (
                                        <tr key={slot._id} className="bg-slate-50/50">
                                            <td className="px-14 py-4 border-l-4 border-violet-600">
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-black text-slate-900">{slot.startTime} - {slot.endTime}</p>
                                                    {slot.bookings?.[0] && (
                                                        <div className="flex items-center gap-2 mt-1 px-2 py-1 bg-violet-600/10 rounded-lg w-fit border border-violet-500/20">
                                                            <Users size={10} className="text-violet-600" />
                                                            <span className="text-[9px] font-black text-violet-700 uppercase tracking-widest truncate max-w-[120px]">{slot.bookings[0].studentName}</span>
                                                            <button onClick={() => handleRemoveStudent(slot.bookings[0].bookingId)} className="text-[8px] font-black text-rose-600 uppercase hover:underline ml-1">Revoke</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-4"><span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${slot.remainingCapacity === 0 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'}`}>{slot.remainingCapacity} / {slot.maxCapacity} Free</span></td>
                                            <td className="px-10 py-4">
                                                <div className="flex gap-4 text-slate-400">
                                                    <button onClick={() => setEditingSlot(slot)} className="hover:text-violet-600 transition-colors"><Edit3 size={14} /></button>
                                                    <button onClick={() => handleToggleStatus(slot._id)} className="hover:text-amber-500 transition-colors"><Settings size={14} /></button>
                                                    <button onClick={() => handleDeleteSlot(slot._id)} className="hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );

    const AuditFeed = () => (
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 h-full shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <History className="text-violet-600" size={24} />
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h3>
                </div>
                {!fullLogs && (
                    <Link to="/admin/logs" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                        All Records
                    </Link>
                )}
            </div>
            <div className="space-y-6">
                {auditLogs.slice(0, fullLogs ? undefined : 8).map((log) => (
                    <div key={log._id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-violet-500/20 transition-all">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.status === 'SUCCESS' ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.3)]' : log.status === 'CANCELLED' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]'}`} />
                        <div className="flex-grow">
                            <p className="text-xs font-black text-slate-900 leading-tight">
                                {log.studentId?.name || 'Unknown User'} <span className="text-slate-300 mx-1">•</span> <span className="text-violet-600 font-black">{log.slotId?.examName || 'Deleted Entity'}</span>
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString()} • {log.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <div className="space-y-12 w-full px-6 lg:px-12 py-10 bg-slate-50 min-h-screen text-slate-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900">Admin Terminal.</h2>
                    <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Infrastructure Control Node</p>
                </div>
                <button onClick={fetchData} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-violet-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <BarChart3 size={16} /> Heartbeat
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, index) => <StatCard key={index} {...stat} />)}
            </div>

            <div className={`grid grid-cols-1 ${(!fullRegistry && !fullLogs) ? 'lg:grid-cols-3' : ''} gap-12`}>
                <div className={(!fullRegistry && !fullLogs) ? 'lg:col-span-2 space-y-12' : 'w-full space-y-12'}>
                    {!fullRegistry && !fullLogs && <DeploymentForm />}
                    {!fullLogs && <RegistryTable />}
                </div>
                {!fullRegistry && <AuditFeed />}
            </div>

            {editingSlot && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <section className="bg-white border border-slate-200 rounded-[3rem] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Modify Node</h3>
                            <button onClick={() => setEditingSlot(null)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdateSlot} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                                <input type="text" value={editingSlot.examName} onChange={(e) => setEditingSlot({ ...editingSlot, examName: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-violet-600" />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setEditingSlot(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
                                <button type="submit" className="flex-1 py-5 bg-violet-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-violet-500/20 hover:bg-violet-700 transition-all">Overwrite</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;