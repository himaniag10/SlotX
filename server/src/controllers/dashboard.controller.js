const User = require("../models/User");
const ExamSlot = require("../models/ExamSlot");
const Booking = require("../models/Booking");
const AuditLog = require("../models/AuditLog");

const getAdminStats = async (req, res, next) => {
    try {
        const adminId = req.user.id;


        const mySlots = await ExamSlot.find({ createdBy: adminId }).select("_id");
        const slotIds = mySlots.map(s => s._id);

        const [totalStudents, activeSlots, totalBookings, failedAttempts] = await Promise.all([
            User.countDocuments({ role: "student" }),
            ExamSlot.countDocuments({ _id: { $in: slotIds }, isEnabled: true }),
            Booking.countDocuments({ slotId: { $in: slotIds } }),
            AuditLog.countDocuments({ slotId: { $in: slotIds }, status: "FAILED" })
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                activeSlots,
                totalBookings,
                failedAttempts
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUserStats = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const [myBookingsCount, availableSlotsCount] = await Promise.all([
            Booking.countDocuments({ studentId }),
            ExamSlot.countDocuments({ isEnabled: true, remainingCapacity: { $gt: 0 } })
        ]);

        res.json({
            success: true,
            data: {
                myBookingsCount,
                availableSlotsCount
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUserActivity = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const activities = await AuditLog.find({ studentId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("slotId", "examName");

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminStats,
    getUserStats,
    getUserActivity
};
