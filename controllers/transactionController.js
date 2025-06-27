const Transaction = require("../models/Transaction");
const AuditLog = require("../models/AuditLog");
const moment = require("moment");
const logTransactionChange = require("../controllers/logTransactionChange");
const User = require("../models/User");

// 🟢 **Create a Transaction**
const createTransaction = async (req, res) => {
  try {
    console.log("🔹 Incoming Transaction Data:", req.body);

    // // Ensure user is authenticated
    // if (!req.user) {
    //   console.log("❌ Unauthorized Request - No User Found backend");
    //   return res.status(401).json({ message: "Unauthorized. Please log in from bankend." });
    // }

    // Extract transaction details from request body
    const {
      user,
      amount,
      status,
      paymentType,
      paymentMethod,
      transactionUserId,
      userAccountNumber,
      userAccountHolderName,
      companyAccountNumber,
      companyAccountHolderName,
      refundStatus,
      refundNote,
      ipAddress,
      rejectionNote,
      createdAt,
      refundedAt,
      orderID,
      referenceID,
      uniqueID,
      branchCode,
      accountNo,
      DepositTransferred,
      NameName,
      TRIdentityNo,
    } = req.body.transactionData;

    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push("amount");
    if (!paymentType) missingFields.push("paymentType");
    if (!paymentMethod) missingFields.push("paymentMethod");
    if (!companyAccountNumber) missingFields.push("companyAccountNumber");
    if (!companyAccountHolderName)
      missingFields.push("companyAccountHolderName");

    if (missingFields.length > 0) {
      console.log("❌ Missing Fields:", missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Get user's IP address
    const userIpAddress =
      ipAddress ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;
    console.log("🔹 User IP Address:", userIpAddress);

    // Create new transaction
    const newTransaction = new Transaction({
      user,
      amount,
      status: status || "pending", // Default to "pending" if not provided
      paymentType,
      paymentMethod,
      transactionUserId,
      userAccountNumber,
      userAccountHolderName,
      companyAccountNumber,
      companyAccountHolderName,
      refundStatus: refundStatus || "pending", // Default to "none" if not provided
      refundNote,
      refundedAt,
      ipAddress: userIpAddress,
      rejectionNote,
      createdAt: createdAt || new Date(),
      refundedAt,
      orderID,
      referenceID,
      uniqueID,
      branchCode,
      accountNo,
      DepositTransferred,
      NameName,
      TRIdentityNo,
    });

    // Save transaction in the database
    await newTransaction.save();
    console.log("✅ Transaction Created Successfully:", newTransaction);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("❌ Transaction Failed:", error);
    res.status(500).json({
      message: "Transaction failed due to server error",
      error: error.message,
    });
  }
};

// 🔵 **Get User Transactions**
const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch transactions", error: error.message });
  }
};

// 🔴 **Get All Transactions (Admin/Finance)**
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch transactions", error: error.message });
  }
};

// 🟠 **Update Transaction Status (Finance Admin)**
const updateTransactionStatus = async (req, res) => {
  try {
    const { status, refundStatus } = req.body;
console.log("aagya",req.body);
    // Validate inputs only if they are provided
    if (status && !["pending", "received", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (
      refundStatus &&
      !["pending", "completed", "rejected"].includes(refundStatus)
    ) {
      return res.status(400).json({ message: "Invalid refund status" });
    }

    const transaction = await Transaction.findById(req.params.id).select(
      "status refundStatus user"
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const logs = [];

    if (status && status !== transaction.status) {
      logs.push(
        logTransactionChange(
          "Update Transaction Status",
          req.user._id,
          transaction.user,
          transaction._id,
          {
            from: transaction.status,
            to: status,
          }
        )
      );
      transaction.status = status;
      transaction.statusUpdatedAt = new Date();
    }

    if (refundStatus && refundStatus !== transaction.refundStatus) {
      logs.push(
        logTransactionChange(
          "Update Refund Status",
          req.user._id,
          transaction.user,
          transaction._id,
          {
            from: transaction.refundStatus,
            to: refundStatus,
          }
        )
      );
      transaction.refundStatus = refundStatus;
      if (refundStatus !== "pending") {
        transaction.refundedAt = new Date();
      }
    }

    await transaction.save();

    if (logs.length > 0) {
      await AuditLog.insertMany(logs);
    }

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 🟢 **Update Refund Status (Finance Admin)**
const updateRefundStatus = async (req, res) => {
  try {
    const { refundStatus } = req.body;

    if (!["pending", "completed", "rejected"].includes(refundStatus)) {
      return res.status(400).json({ message: "Invalid refund status" });
    }

    // Find the transaction
    const transaction = await Transaction.findById(req.params.id).select(
      "refundStatus user"
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (refundStatus === transaction.refundStatus) {
      return res.status(200).json({ message: "No changes made", transaction });
    }

    const oldRefundStatus = transaction.refundStatus;
    transaction.refundStatus = refundStatus;
    if (refundStatus !== "pending") {
      transaction.refundedAt = new Date();
    }
    await transaction.save();

    await AuditLog.create(
      logTransactionChange(
        "Update Refund Status",
        req.user._id,
        transaction.user,
        transaction._id,
        {
          from: oldRefundStatus,
          to: refundStatus,
        }
      )
    );

    res.json({ message: "Refund status updated", transaction });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// **Statistics function**
const getTransactionStats = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    const lastWeek = moment().subtract(1, "weeks").startOf("week");
    const lastMonth = moment().subtract(1, "months").startOf("month");
    const lastYear = moment().subtract(1, "years").startOf("year");

    // Get combined stats (status + refundStatus)
    const getStatsForPeriod = async (startDate, endDate) => {
      return await Transaction.aggregate([
        {
          $match: {
            $or: [
              {
                createdAt: { $gte: startDate.toDate(), $lt: endDate.toDate() },
              },
              {
                statusUpdatedAt: {
                  $gte: startDate.toDate(),
                  $lt: endDate.toDate(),
                },
              },
              {
                refundedAt: { $gte: startDate.toDate(), $lt: endDate.toDate() },
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            totalTransactions: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ["$createdAt", startDate.toDate()] },
                      { $lt: ["$createdAt", endDate.toDate()] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalAmount: { $sum: "$amount" },

            // Transaction status counts
            pendingCount: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            receivedCount: {
              $sum: { $cond: [{ $eq: ["$status", "received"] }, 1, 0] },
            },
            rejectedCount: {
              $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
            },

            // Transaction status amounts
            pendingAmount: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
            },
            receivedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "received"] }, "$amount", 0] },
            },
            rejectedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "rejected"] }, "$amount", 0] },
            },

            // Refund status counts
            refundPendingCount: {
              $sum: { $cond: [{ $eq: ["$refundStatus", "pending"] }, 1, 0] },
            },
            refundCompletedCount: {
              $sum: { $cond: [{ $eq: ["$refundStatus", "completed"] }, 1, 0] },
            },
            refundRejectedCount: {
              $sum: { $cond: [{ $eq: ["$refundStatus", "rejected"] }, 1, 0] },
            },

            // Refund status amounts
            refundPendingAmount: {
              $sum: {
                $cond: [{ $eq: ["$refundStatus", "pending"] }, "$amount", 0],
              },
            },
            refundCompletedAmount: {
              $sum: {
                $cond: [{ $eq: ["$refundStatus", "completed"] }, "$amount", 0],
              },
            },
            refundRejectedAmount: {
              $sum: {
                $cond: [{ $eq: ["$refundStatus", "rejected"] }, "$amount", 0],
              },
            },
          },
        },
        {
          $addFields: {
            commission: { $multiply: ["$receivedAmount", 0.3] }, // Changed from totalAmount to receivedAmount
          },
        },
      ]);
    };

    const timeFrames = [
      [today, moment(today).endOf("day")],
      [yesterday, moment(yesterday).endOf("day")],
      [lastWeek, moment().endOf("week")],
      [lastMonth, moment().endOf("month")],
      [lastYear, moment().endOf("year")],
    ];

    const [
      todayStats,
      yesterdayStats,
      lastWeekStats,
      lastMonthStats,
      lastYearStats,
    ] = await Promise.all(
      timeFrames.map(([start, end]) => getStatsForPeriod(start, end))
    );

    res.json({
      stats: {
        today: todayStats[0] || {},
        yesterday: yesterdayStats[0] || {},
        lastWeek: lastWeekStats[0] || {},
        lastMonth: lastMonthStats[0] || {},
        lastYear: lastYearStats[0] || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

// Update Transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('update transac',req.body)
    const {
      status,
      transactionUserId,
      userAccountNumber,
      userAccountHolderName,
      rejectionNote,
      refundNote,
    } = req.body;

    const transaction = await Transaction.findById(id).populate("user");
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let shouldAddAmount = false;

    if (status && status !== transaction.status) {
      // Status is changing
      if (
        (transaction.status === "pending" ||
          transaction.status === "rejected") &&
        status === "received"
      ) {
        shouldAddAmount = true;
      }
      transaction.status = status;
    } else if (status === "received" && transaction.status === "received") {
      if (!transaction.amountAddedToBalance) {
        shouldAddAmount = true;
      }
    }

    // Update additional fields if they are provided in the request
    if (transactionUserId !== undefined) {
      transaction.transactionUserId = transactionUserId;
    }
    if (userAccountNumber !== undefined) {
      transaction.userAccountNumber = userAccountNumber;
    }
    if (userAccountHolderName !== undefined) {
      transaction.userAccountHolderName = userAccountHolderName;
    }
    if (rejectionNote !== undefined) {
      transaction.rejectionNote = rejectionNote;
    }
    if (refundNote !== undefined) {
      transaction.refundNote = refundNote;
    }
console.log('transaction update ho gya',transaction)
    await transaction.save();

    if (shouldAddAmount && transaction.user) {
      const user = await User.findById(transaction.user._id);
      if (user) {
        user.bankAccount = (
          parseFloat(user.bankAccount) + parseFloat(transaction.amount)
        ).toString();
        await user.save();

        transaction.amountAddedToBalance = true;
        await transaction.save();
      }
    }

    res.json({ message: "Transaction updated", transaction });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update transaction", error: err.message });
  }
};

const getAllTransactionsWithUserAndUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user'); // populate user details

    const result = await Promise.all(
      transactions.map(async (transaction) => {
        if (!transaction.user) {
          // If user is null, skip user transactions
          return {
            transactionDetails: transaction,
            allUserTransactions: [],
          };
        }

        const userTransactions = await Transaction.find({ user: transaction.user._id });

        return {
          transactionDetails: transaction,
          allUserTransactions: userTransactions,
        };
      })
    );

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  updateTransactionStatus,
  getTransactionStats,
  updateRefundStatus,
  updateTransaction,
  getAllTransactionsWithUserAndUserTransactions,
};
