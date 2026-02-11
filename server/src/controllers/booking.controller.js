const ExamSlot = require("../models/ExamSlot");
const Booking = require("../models/Booking");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/ApiError");

const getAvailableSlots = async (req, res, next) => {
    try {
        const slots = await ExamSlot.find({
            isEnabled: true,
        }).sort({ date: 1, startTime: 1 });

        res.json({
            success: true,
            data: slots,
        });
    } catch (error) {
        next(error);
    }
};

const bookSlot = async (req, res, next) => {
    const { slotId, examId, requestId } = req.body;
    const studentId = req.user.id;

    try {
        if (!slotId || !examId || !requestId) {
            throw new ApiError(400, "Missing required fields: slotId, examId, requestId");
        }


        const existingBooking = await Booking.findOne({ studentId, examId });
        if (existingBooking) {

            await AuditLog.create({
                studentId,
                examId,
                slotId,
                status: "FAILED",
                reason: "You can book max only one slot in a Priority Windows",
                requestId,
            });
            throw new ApiError(400, "You can book max only one slot in a Priority Windows");
        }


        const slot = await ExamSlot.findOneAndUpdate(
            { _id: slotId, isEnabled: true, remainingCapacity: { $gt: 0 } },
            { $inc: { remainingCapacity: -1 } },
            { new: true }
        );

        if (!slot) {

            await AuditLog.create({
                studentId,
                examId,
                slotId,
                status: "FAILED",
                reason: "Slot full or disabled",
                requestId,
            });
            throw new ApiError(400, "Slot full");
        }


        await Booking.create({
            studentId,
            examId,
            slotId,
            requestId,
        });


        await AuditLog.create({
            studentId,
            examId,
            slotId,
            status: "SUCCESS",
            requestId,
        });

        res.status(201).json({
            success: true,
            message: "Booking confirmed",
        });
    } catch (error) {
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ studentId: req.user.id })
            .populate("slotId", "examName date startTime endTime")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

const cancelBooking = async (req, res, next) => {
    const { id } = req.params;
    const studentId = req.user.id;

    try {
        const booking = await Booking.findOne({ _id: id, studentId });
        if (!booking) {
            throw new ApiError(404, "Booking not found or not authorized");
        }


        await ExamSlot.findByIdAndUpdate(booking.slotId, {
            $inc: { remainingCapacity: 1 }
        });


        await Booking.findByIdAndDelete(id);


        await AuditLog.create({
            studentId,
            examId: booking.examId,
            slotId: booking.slotId,
            status: "CANCELLED",
        });

        res.json({
            success: true,
            message: "Booking cancelled successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAvailableSlots,
    bookSlot,
    getMyBookings,
    cancelBooking,
};
