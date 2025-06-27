const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "username email")
      .populate("targetUser", "username email")
      .populate("transactionId", "_id amount status")
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch logs", error: error.message });
  }
};

module.exports = { getAuditLogs };
