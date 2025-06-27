const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  approveFinanceUser,
  getFinanceUsers,
  getUserStats,
  getAllUsers,
  loginOrAutoRegister,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/loginautoregister", loginOrAutoRegister);
router.get("/profile", getUserProfile);
router.put("/approve-finance/:id", approveFinanceUser);
router.get("/users", getFinanceUsers);
router.get("/users/statistics", getUserStats);
router.get("/regularusers", getAllUsers);

module.exports = router;
