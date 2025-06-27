const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { updateUserProfile } = require("../controllers/userController");

const router = express.Router();

// Update profile route (expects PUT request)
// This route assumes that req.user is available from session authentication.
router.put("/update", isAuthenticated, updateUserProfile);

module.exports = router;
