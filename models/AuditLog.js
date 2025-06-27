const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "Update Transaction Status"
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Finance team member
    required: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User whose data was updated
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  changes: { type: Object }, // What exactly was changed
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
