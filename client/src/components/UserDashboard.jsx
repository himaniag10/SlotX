import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, ArrowRight, Loader2, Search, Bell, X, ChevronRight } from 'lucide-react';
import { bookingApi, getErrorMessage } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const StatCard = ({ label, value }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 mb-1">{label}</p>
        <p className="text-4xl font-black tracking-tighter text-slate-900">{value}</p>
    </div>
);

const RegistrySection = ({ fullView, isAnyFullView, processedSlots, setSelectedExam }) => (
    <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl shadow-sm">
                    <Calendar className="text-violet-500" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        {fullView ? 'Deployment Registry' : 'Priority Windows'}
                    </h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Available for immediate allocation</p>
                </div>
            </div>
            {!isAnyFullView && (
                <Link to="/dashboard/reservations" className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-violet-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 group">
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
            <div className={`grid grid-cols-1 md:grid-cols-2 ${fullView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                {processedSlots.slice(0, fullView ? undefined : 8).map((exam) => (
                    <div key={exam.id} onClick={() => setSelectedExam(exam)} className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-500/30 transition-all duration-300 cursor-pointer shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-center min-w-[60px]">
                                <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">{new Date(exam.date).toLocaleString('default', { month: 'short' })}</p>
                                <p className="text-xl font-black text-slate-900">{new Date(exam.date).getDate()}</p>
                            </div>
                            <div className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg ${exam.isBookedByMe ? 'bg-violet-600 text-white' : exam.availableSpots === 0 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'}`}>
                                {exam.isBookedByMe ? 'SECURED' : exam.availableSpots === 0 ? 'FULL' : `${exam.availableSpots} SPOTS`}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-lg font-black text-slate-900 overflow-hidden line-clamp-1">{exam.examName}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Portal: {exam.adminName}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest flex items-center gap-2">
                                Assess <ArrowRight size={10} />
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exam.slots.length} Slots</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
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
                examId: selectedExam.id,
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
            const adminId = slot.createdBy?._id || 'unknown';
            const key = `${slot.examName}_${dateStr}_${adminId}`;
            if (!acc[key]) {
                acc[key] = {
                    id: key,
                    examName: slot.examName,
                    date: slot.date,
                    slots: [],
                    totalSpots: 0,
                    availableSpots: 0,
                    isBookedByMe: false,
                    adminName: slot.createdBy?.name || 'Administrator'
                };
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
                <Loader2 className="animate-spin text-violet-600 mb-2" size={24} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Portal Syncing...</p>
            </div>
        );
    }

    const isAnyFullView = fullView || fullActive || fullActivity;



    return (
        <div className="space-y-16 w-full px-6 lg:px-12 py-12 animate-in fade-in duration-700 bg-slate-50 min-h-screen">
            {!isAnyFullView && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
                            Welcome, <span className="text-violet-600">{user?.name.split(' ')[0]}.</span>
                        </h2>
                        <p className="text-slate-500 text-base font-medium max-w-lg">
                            <span className="text-slate-900 font-bold">{stats.availableSlotsCount} active windows</span> available for booking.
                        </p>
                    </div>
                    <div className="w-full md:w-auto min-w-[200px]">
                        <StatCard label="Reserved" value={stats.myBookingsCount} />
                    </div>
                </div>
            )}

            {!fullActive && !fullActivity && (
                <RegistrySection
                    fullView={fullView}
                    isAnyFullView={isAnyFullView}
                    processedSlots={processedSlots}
                    setSelectedExam={setSelectedExam}
                />
            )}

            {!fullView && (
                <div className={`grid grid-cols-1 ${(!fullActive && !fullActivity) ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-12`}>
                    {!fullActivity && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-teal-50 border border-teal-100 p-2.5 rounded-xl">
                                        <CheckCircle2 className="text-teal-600" size={20} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Units</h3>
                                </div>
                                {!isAnyFullView && (
                                    <Link to="/dashboard/active" className="text-xs font-bold text-violet-600 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                        Manage
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
                                        <div key={booking._id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="font-bold text-slate-900">{booking.slotId?.examName || 'System Unit'}</p>
                                                <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mt-0.5">{booking.slotId?.startTime} - {booking.slotId?.endTime}</p>
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
                                    <div className="bg-violet-50 border border-violet-100 p-2.5 rounded-xl">
                                        <Bell className="text-violet-600" size={20} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                                </div>
                                {!isAnyFullView && (
                                    <Link to="/dashboard/activity" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                        View All
                                    </Link>
                                )}
                            </div>
                            <div className="space-y-4">
                                {activity.slice(0, fullActivity ? undefined : 3).map((item) => (
                                    <div key={item._id} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.status === 'SUCCESS' ? 'bg-teal-500' : 'bg-rose-500'}`} />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    {new Date(item.createdAt).toLocaleTimeString()}
                                                </p>
                                                <p className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.status === 'SUCCESS' ? 'bg-teal-500/10 text-teal-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                                    {item.status}
                                                </p>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">{item.slotId?.examName || 'System Window'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedExam && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl relative p-8">
                        <button onClick={() => setSelectedExam(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                        <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{selectedExam.examName}</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {selectedExam.slots.map(slot => {
                                const isBooked = myBookings.some(b => b.slotId?._id === slot._id);
                                const isFull = slot.remainingCapacity === 0;
                                return (
                                    <div key={slot._id} className={`p-5 rounded-2xl border ${isBooked ? 'bg-violet-50 border-violet-200' : isFull ? 'bg-slate-50 border-slate-100 opacity-50 text-slate-400' : 'bg-slate-50 border-slate-100 hover:border-violet-200 transition-all text-slate-900'} flex items-center justify-between`}>
                                        <div>
                                            <p className="text-base font-bold">{slot.startTime} - {slot.endTime}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{isBooked ? 'Secured' : isFull ? 'Full' : `${slot.remainingCapacity} available`}</p>
                                        </div>
                                        {isBooked ? (
                                            <button onClick={() => handleCancelBooking(myBookings.find(b => b.slotId?._id === slot._id)._id)} className="text-xs font-bold text-rose-600 uppercase tracking-widest hover:underline">Revoke</button>
                                        ) : (
                                            <button
                                                disabled={isFull || !!bookingInProgress || selectedExam.isBookedByMe}
                                                onClick={() => handleBookSlot(slot)}
                                                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isFull || selectedExam.isBookedByMe ? 'bg-slate-200 text-slate-400' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/10'}`}
                                            >
                                                {bookingInProgress === slot._id ? <Loader2 className="animate-spin" size={14} /> : (selectedExam.isBookedByMe ? 'Limit Met' : 'Deploy')}
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
