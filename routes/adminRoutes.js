const express = require("express");
const { createUserByAdmin, updateUserRole, deleteUser ,savedeposit} = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/create-user", isAuthenticated, isAdmin, createUserByAdmin);

router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/users/:id", isAuthenticated, isAdmin, updateUserRole);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);

router.post("/users/deposit",savedeposit)


module.exports = router;
