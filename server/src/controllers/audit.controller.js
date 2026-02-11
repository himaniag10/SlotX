const AuditLog = require("../models/AuditLog");
const ExamSlot = require("../models/ExamSlot");
const User = require("../models/User");

const getAuditLogs = async (req, res, next) => {
    try {
        const adminId = req.user.id;
        const mySlots = await ExamSlot.find({ createdBy: adminId }).select("_id");
        const slotIds = mySlots.map(s => s._id);

        const logs = await AuditLog.find({ slotId: { $in: slotIds } })
            .populate("studentId", "name email")
            .populate("slotId", "examName date startTime")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAuditLogs,
};
