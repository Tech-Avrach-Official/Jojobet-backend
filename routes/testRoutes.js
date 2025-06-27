const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddleware");


router.get("/protected", isAdmin, (req, res) => {
  res.json({ message: "Welcome, Admin!", user: req.user });
});

module.exports = router;
