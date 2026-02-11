const ExamSlot = require("../models/ExamSlot");
const Booking = require("../models/Booking");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/ApiError");

const createSlot = async (req, res, next) => {
    try {
        const { examName, date, startTime, endTime, maxCapacity, slotDuration } = req.body;

        if (!examName || !date || !startTime || !endTime || !maxCapacity) {
            throw new ApiError(400, "All fields are required");
        }


        const toMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };


        const toTimeStr = (totalMin) => {
            const h = Math.floor(totalMin / 60);
            const m = totalMin % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        let start = toMinutes(startTime);
        let end = toMinutes(endTime);
        let duration = parseInt(slotDuration) || (end - start);

        if (start >= end) {
            throw new ApiError(400, "Start time must be before end time");
        }

        const slotsToCreate = [];
        let current = start;

        while (current + duration <= end) {
            slotsToCreate.push({
                examName,
                date,
                startTime: toTimeStr(current),
                endTime: toTimeStr(current + duration),
                maxCapacity,
                remainingCapacity: maxCapacity,
                createdBy: req.user.id
            });
            current += duration;
        }

        if (slotsToCreate.length === 0) {

            slotsToCreate.push({
                examName,
                date,
                startTime: toTimeStr(start),
                endTime: toTimeStr(end),
                maxCapacity,
                remainingCapacity: maxCapacity,
                createdBy: req.user.id
            });
        }

        const createdSlots = await ExamSlot.insertMany(slotsToCreate);

        res.status(201).json({
            success: true,
            message: `${createdSlots.length} slots created successfully`,
            data: createdSlots,
        });
    } catch (error) {
        next(error);
    }
};

const getAdminSlots = async (req, res, next) => {
    try {
        const slots = await ExamSlot.find({ createdBy: req.user.id }).sort({ date: 1, startTime: 1 }).lean();


        const bookings = await Booking.find()
            .populate("studentId", "name email")
            .lean();


        const slotBookingsMap = {};
        bookings.forEach(b => {
            const sid = b.slotId.toString();
            if (!slotBookingsMap[sid]) {
                slotBookingsMap[sid] = [];
            }
            slotBookingsMap[sid].push({
                bookingId: b._id,
                studentName: b.studentId?.name,
                studentEmail: b.studentId?.email
            });
        });

        const enrichedSlots = slots.map(slot => ({
            ...slot,
            bookings: slotBookingsMap[slot._id.toString()] || []
        }));

        res.json({
            success: true,
            data: enrichedSlots,
        });
    } catch (error) {
        next(error);
    }
};

const toggleSlotStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const slot = await ExamSlot.findOne({ _id: id, createdBy: req.user.id });

        if (!slot) {
            throw new ApiError(404, "Slot not found or unauthorized");
        }

        slot.isEnabled = !slot.isEnabled;
        await slot.save();

        res.json({
            success: true,
            message: `Slot ${slot.isEnabled ? "enabled" : "disabled"} successfully`,
            data: slot,
        });
    } catch (error) {
        next(error);
    }
};

const getSlotBookings = async (req, res, next) => {
    try {
        const { id } = req.params;
        const slot = await ExamSlot.findOne({ _id: id, createdBy: req.user.id });
        if (!slot) {
            throw new ApiError(404, "Slot not found or unauthorized");
        }
        const bookings = await Booking.find({ slotId: id }).populate("studentId", "name email");

        res.json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

const updateSlot = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { examName, date, startTime, endTime, maxCapacity } = req.body;

        const slot = await ExamSlot.findOne({ _id: id, createdBy: req.user.id });
        if (!slot) {
            throw new ApiError(404, "Slot not found or unauthorized");
        }

        if (examName) slot.examName = examName;
        if (date) slot.date = date;
        if (startTime) slot.startTime = startTime;
        if (endTime) slot.endTime = endTime;

        if (maxCapacity !== undefined) {
            const bookingsCount = slot.maxCapacity - slot.remainingCapacity;
            if (maxCapacity < bookingsCount) {
                throw new ApiError(400, `Cannot reduce capacity below current bookings count (${bookingsCount})`);
            }
            slot.remainingCapacity = maxCapacity - bookingsCount;
            slot.maxCapacity = maxCapacity;
        }

        await slot.save();

        res.json({
            success: true,
            message: "Slot updated successfully",
            data: slot,
        });
    } catch (error) {
        next(error);
    }
};

const deleteSlot = async (req, res, next) => {
    try {
        const { id } = req.params;
        const slot = await ExamSlot.findOne({ _id: id, createdBy: req.user.id });

        if (!slot) {
            throw new ApiError(404, "Slot not found or unauthorized");
        }


        const bookingsCount = await Booking.countDocuments({ slotId: id });
        if (bookingsCount > 0) {
            throw new ApiError(400, "Cannot delete slot with existing bookings. Please cancel bookings first.");
        }

        await ExamSlot.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Slot deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

const adminRemoveBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate("slotId");

        if (!booking) {
            throw new ApiError(404, "Booking not found");
        }

        if (booking.slotId.createdBy.toString() !== req.user.id) {
            throw new ApiError(403, "Not authorized to manage this booking");
        }


        await ExamSlot.findByIdAndUpdate(booking.slotId, {
            $inc: { remainingCapacity: 1 }
        });


        await Booking.findByIdAndDelete(id);


        await AuditLog.create({
            studentId: booking.studentId,
            examId: booking.examId,
            slotId: booking.slotId,
            status: "CANCELLED",
            reason: "Removed by Administrator",
        });

        res.json({
            success: true,
            message: "Student removed from slot successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSlot,
    getAdminSlots,
    toggleSlotStatus,
    getSlotBookings,
    adminRemoveBooking,
    updateSlot,
    deleteSlot,
};
