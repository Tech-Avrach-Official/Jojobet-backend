const Transaction = require("../models/Transaction");
const User = require("../models/User");
const CompanyAccount = require("../models/CompanyAccount");

// Get all transactions (for finance team)
const getAllTransactionsForFinance = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user", "email username bankAccount");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user's bank account details
const updateUserBankDetails = async (req, res) => {
  try {
    const { bankAccount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.bankAccount = bankAccount || user.bankAccount;
    await user.save();
    res.json({ message: "User bank details updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get or update company account details
const getCompanyAccount = async (req, res) => {
  try {
    const account = await CompanyAccount.findOne();
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompanyAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, routingNumber, balance } = req.body;
    let account = await CompanyAccount.findOne();
    if (!account) {
      account = new CompanyAccount({ bankName, accountNumber, routingNumber, balance });
    } else {
      account.bankName = bankName || account.bankName;
      account.accountNumber = accountNumber || account.accountNumber;
      account.routingNumber = routingNumber || account.routingNumber;
      account.balance = balance !== undefined ? balance : account.balance;
    }
    await account.save();
    res.json({ message: "Company account updated", account });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markTransactionReceivedFinance = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    transaction.status = "completed";
    await transaction.save();
    res.json({ message: "Transaction marked as received", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTransactionsForFinance,
  updateUserBankDetails,
  getCompanyAccount,
  updateCompanyAccount,
  markTransactionReceivedFinance,
};
