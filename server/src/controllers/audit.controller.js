const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
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
