import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, ArrowRight, Loader2, Search, Bell, X, ChevronRight } from 'lucide-react';
import { bookingApi, getErrorMessage } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const StatCard = ({ label, value }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-2">{label}</p>
        <p className="text-5xl font-black tracking-tighter text-slate-900">{value}</p>
    </div>
);

const UserDashboard = ({ user, fullView = false, fullActive = false, fullActivity = false }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [stats, setStats] = useState({ myBookingsCount: 0, availableSlotsCount: 0 });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingInProgress, setBookingInProgress] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [slotsRes, bookingsRes, statsRes, activityRes] = await Promise.all([
                bookingApi.getAvailableSlots(),
                bookingApi.getMyBookings(),
                bookingApi.getStats(),
                bookingApi.getActivity()
            ]);
            setAvailableSlots(slotsRes.data);
            setMyBookings(bookingsRes.data);
            setStats(statsRes.data);
            setActivity(activityRes.data);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBookSlot = async (slot) => {
        try {
            setBookingInProgress(slot._id);
            const requestId = uuidv4();
            await bookingApi.bookSlot({
                slotId: slot._id,
                examId: slot.examName,
                requestId: requestId
            });
            toast.success("Spot secured successfully!");
            fetchData();
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setBookingInProgress(null);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            setBookingInProgress("cancelling");
            await bookingApi.cancelBooking(bookingId);
            toast.success("Reservation cancelled");
            fetchData();
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setBookingInProgress(null);
        }
    };

    const processedSlots = useMemo(() => {
        const grouped = availableSlots.reduce((acc, slot) => {
            const dateStr = new Date(slot.date).toISOString().split('T')[0];
            const key = `${slot.examName}_${dateStr}`;
            if (!acc[key]) {
                acc[key] = { id: key, examName: slot.examName, date: slot.date, slots: [], totalSpots: 0, availableSpots: 0, isBookedByMe: false };
            }
            acc[key].slots.push(slot);
            acc[key].totalSpots += slot.maxCapacity;
            acc[key].availableSpots += slot.remainingCapacity;
            if (myBookings.some(b => b.slotId?._id === slot._id)) acc[key].isBookedByMe = true;
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [availableSlots, myBookings]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-violet-600 mb-2" size={32} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Portal Syncing...</p>
            </div>
        );
    }

    const isAnyFullView = fullView || fullActive || fullActivity;

    const RegistrySection = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl shadow-sm">
                        <Calendar className="text-violet-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            {fullView ? 'Deployment Registry' : 'Priority Windows'}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Available for immediate allocation</p>
                    </div>
                </div>
                {!isAnyFullView && (
                    <Link to="/dashboard/reservations" className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-violet-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 group">
                        Full Registry
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            {processedSlots.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-200 border-dashed relative overflow-hidden">
                    <Search className="mx-auto text-slate-200 mb-6" size={64} />
                    <h4 className="text-2xl font-black text-slate-900">Zero Windows Found</h4>
                    <p className="text-slate-500 mt-3 font-medium">The registry is currently empty.</p>
                </div>
            ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${fullView ? 'lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'} gap-8`}>
                    {processedSlots.slice(0, fullView ? undefined : 6).map((exam) => (
                        <div key={exam.id} onClick={() => setSelectedExam(exam)} className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-violet-500/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm">
                            <div className="flex justify-between items-start mb-8">
                                <div className="bg-violet-600/10 border border-violet-500/20 px-5 py-3 rounded-2xl text-center">
                                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{new Date(exam.date).toLocaleString('default', { month: 'short' })}</p>
                                    <p className="text-2xl font-black text-slate-900">{new Date(exam.date).getDate()}</p>
                                </div>
                                <div className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl ${exam.isBookedByMe ? 'bg-violet-600 text-white' : exam.availableSpots === 0 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'}`}>
                                    {exam.isBookedByMe ? 'SECURED' : exam.availableSpots === 0 ? 'WINDOW FULL' : `${exam.availableSpots} SPOTS`}
                                </div>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 h-14 overflow-hidden mb-6">{exam.examName}</h4>
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-2">
                                    Inspect <ArrowRight size={12} />
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exam.slots.length} Windows</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-16 w-full px-6 lg:px-12 py-12 animate-in fade-in duration-700 bg-slate-50 min-h-screen">
            {!isAnyFullView && (
                <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">
                            Welcome back, <span className="text-violet-600">{user?.name.split(' ')[0]}.</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-lg">
                            Central command is online. You have access to <span className="text-slate-900 font-black">{stats.availableSlotsCount} deployment windows</span> for immediate allocation.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <StatCard label="Reserved Units" value={stats.myBookingsCount} />
                    </div>
                </div>
            )}

            {!fullActive && !fullActivity && <RegistrySection />}

            {!fullView && (
                <div className={`grid grid-cols-1 ${(!fullActive && !fullActivity) ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-12`}>
                    {!fullActivity && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-teal-50 border border-teal-100 p-3 rounded-2xl">
                                        <CheckCircle2 className="text-teal-600" size={24} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Active Units</h3>
                                </div>
                                {!isAnyFullView && (
                                    <Link to="/dashboard/active" className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">
                                        Management
                                    </Link>
                                )}
                            </div>

                            {myBookings.length === 0 ? (
                                <div className="bg-white/5 border border-white/5 border-dashed rounded-[2.5rem] p-12 text-center text-gray-600">
                                    <p className="font-black uppercase tracking-widest text-[10px]">No active units detected</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myBookings.slice(0, fullActive ? undefined : 3).map((booking) => (
                                        <div key={booking._id} className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between hover:border-violet-500/20 transition-all shadow-sm">
                                            <div>
                                                <p className="font-black text-slate-900 text-lg">{booking.slotId?.examName || 'System Unit'}</p>
                                                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-1">{booking.slotId?.startTime} - {booking.slotId?.endTime}</p>
                                            </div>
                                            <button onClick={() => handleCancelBooking(booking._id)} className="px-4 py-2 border border-rose-500/20 text-rose-600 text-[9px] font-black uppercase rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                                Terminate
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!fullActive && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-violet-50 border border-violet-100 p-3 rounded-2xl">
                                        <Bell className="text-violet-600" size={24} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">System Logs</h3>
                                </div>
                                {!isAnyFullView && (
                                    <Link to="/dashboard/activity" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">
                                        Full Log
                                    </Link>
                                )}
                            </div>
                            <div className="space-y-4">
                                {activity.slice(0, fullActivity ? undefined : 4).map((item) => (
                                    <div key={item._id} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.status === 'SUCCESS' ? 'bg-teal-500' : 'bg-rose-500'}`} />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {new Date(item.createdAt).toLocaleTimeString()}
                                                </p>
                                                <p className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.status === 'SUCCESS' ? 'bg-teal-500/10 text-teal-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                                    {item.status}
                                                </p>
                                            </div>
                                            <p className="text-sm font-black text-slate-900">{item.slotId?.examName || 'System Window'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedExam && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-xl shadow-2xl relative p-10 overflow-hidden">
                        <button onClick={() => setSelectedExam(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
                        <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">{selectedExam.examName}</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {selectedExam.slots.map(slot => {
                                const isBooked = myBookings.some(b => b.slotId?._id === slot._id);
                                const isFull = slot.remainingCapacity === 0;
                                return (
                                    <div key={slot._id} className={`p-6 rounded-3xl border ${isBooked ? 'bg-violet-600/10 border-violet-500' : isFull ? 'bg-slate-50 border-slate-100 opacity-50 text-slate-400' : 'bg-slate-50 border-slate-100 hover:border-violet-500/50 transition-all text-slate-900'} flex items-center justify-between`}>
                                        <div>
                                            <p className="text-lg font-black">{slot.startTime} - {slot.endTime}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{isBooked ? 'Unit Secured' : isFull ? 'Allocation Maxed' : `${slot.remainingCapacity} seats available`}</p>
                                        </div>
                                        {isBooked ? (
                                            <button onClick={() => handleCancelBooking(myBookings.find(b => b.slotId?._id === slot._id)._id)} className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">Revoke</button>
                                        ) : (
                                            <button
                                                disabled={isFull || !!bookingInProgress || selectedExam.isBookedByMe}
                                                onClick={() => handleBookSlot(slot)}
                                                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isFull || selectedExam.isBookedByMe ? 'bg-slate-200 text-slate-400' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-xl shadow-violet-500/20'}`}
                                            >
                                                {bookingInProgress === slot._id ? <Loader2 className="animate-spin" size={16} /> : (selectedExam.isBookedByMe ? 'Limit Met' : 'Deploy')}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;