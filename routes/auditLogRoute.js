const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditLogController");
const { isAuthenticated, isAdmin,isAdminOrFinanceAdmin } = require("../middleware/authMiddleware");

router.get("/audit-logs",isAdminOrFinanceAdmin, getAuditLogs);

module.exports = router;
