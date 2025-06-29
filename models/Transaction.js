const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "received", "rejected"],
    default: "pending",
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  paymentType: {
    type: String,
    enum: ["Tether", "JojoBET","Anında_Banka","Havale","Fast_Havale","Jet_Havale","Bitcoin","Tron","7/24_Havale","Hizli_Havale","PayCo","ParolaPara","ParolaPara_2","Doge","Ethereum"],
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  transactionUserId: {
    type: String,
  },
  userAccountNumber: {
    type: String,
  },
  userAccountHolderName: {
    type: String,
  },
  companyAccountNumber: {
    type: String,
  },
  companyAccountHolderName: {
    type: String,
  },
  refundStatus: {
    type: String,
    enum: ["pending", "completed", "rejected"],
    default: "pending",
  },
  refundNote: {
    type: String,
  },
  refundedAt: {
    type: Date,
  },
  amountProcessed: {  // New field to track if amount was added
    type: Boolean,
    default: false
  },
  ipAddress: { type: String },
  rejectionNote: { type: String },
  orderID: { type: String },
  referenceID: { type: String },
  uniqueID: { type: String },
  branchCode: {
    type: String, 
  },
  accountNo:{
    type: String ,
  },
  DepositTransferred:{
    type: String,
  },
  NameName:{
    type: String ,
  },
  TRIdentityNo:{
    type: String ,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
