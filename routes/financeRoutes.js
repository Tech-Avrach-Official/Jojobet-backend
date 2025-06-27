const express = require("express");
const Transaction = require("../models/Transaction");

const {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateTransactionStatus,
} = require("../controllers/financeController");
const { isAuthenticated, isFinance } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 **Admin Routes**
router.get("/all", isAuthenticated, isFinance, async (req, res) => {
  try {
    // Fetch transactions and populate the entire 'user' object
    const transactions = await Transaction.find()
      .populate("user") // Populates the entire user object
      .sort({ createdAt: -1 });
    console.log("alltransactions:", transactions);
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch transactions", error: error.message });
  }
});

router.put("/update/:id", isAuthenticated, isFinance, async (req, res) => {
  // <-- async keyword added
  try {
    console.log("Backend aa gya", req.params);
    console.log("req.params.id:", req.params.id);

    // Ensure updateData is received
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Update transaction with req.body
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body, // <-- Ensure req.body is passed
      { new: true, runValidators: true } // Ensure validation and return updated doc
    );

    console.log("Transaction updated", transaction);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

module.exports = router;
