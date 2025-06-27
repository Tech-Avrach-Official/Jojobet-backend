const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin, isFinanceAdmin, isAdminFinanceOrFinanceAdmin, isAdminOrFinanceAdmin} = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  updateRefundStatus,
  getTransactionStats,
  updateTransactionStatus,
  updateTransaction,
  getAllTransactionsWithUserAndUserTransactions,
} = require("../controllers/transactionController");

// 🔹 **User Transactions**
router.post("/create", createTransaction);
router.get("/user", isAuthenticated, getUserTransactions);


// 🔹 **Admin, finance admin and Finance route**
router.get("/all",  getAllTransactionsWithUserAndUserTransactions);

// Update refund status by admin or by finance team
router.put("/update-refundStatus/:id", isAuthenticated, isAdminFinanceOrFinanceAdmin, updateRefundStatus);

// Update Transation by admin or by finance team
router.put("/update-transactionStatus/:id", isAuthenticated, isAdminFinanceOrFinanceAdmin, updateTransactionStatus);

// Route to get statistics
router.get('/statistics',  getTransactionStats);

// Route to Update Transaction
router.put('/:id', isAuthenticated, isAdminFinanceOrFinanceAdmin, updateTransaction);

// Route to Delete Transaction
router.delete("/delete/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully", transaction });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete transaction", error: error.message });
  }
});

module.exports = router;
