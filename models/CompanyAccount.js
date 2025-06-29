const mongoose = require("mongoose");

const CompanyAccountSchema = new mongoose.Schema({
  bankName: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String, 
  },
  type:{
    type: String,
    default: "real time"
  },
  recommended:{
    type: Boolean,
    default: false
  },
  amountField:{
    type: Boolean,
    default: false
  },
  image: { 
    type: String 
  },
  QRcode: { 
    type: String 
  },
  min: { 
    type: Number 
  },
  max: { 
    type: Number 
  },
  paymentType: { 
    type: String, 
    enum: ["Tether", "JojoBET","Anında_Banka","Havale","Havale2","Fast_Havale","Jet_Havale","Bitcoin","Tron","7/24_Havale","Hizli_Havale","PayCo","ParolaPara","ParolaPara_2","Doge","Ethereum"], 
    required: true 
  },
  accountHolderName: { 
    type: String 
  },
  accountNumber: { 
    type: String 
  },
  paymentMethod: { 
    type: String, 
  }, 
  WalletAddress: { 
    type: String 
  },
  branchCode: {
    type: String 
  },
  accountNo:{
    type: String 
  },
  DepositTransferred:{
    type: String
  },
  NameName:{
    type: String 
  },
  TRIdentityNo:{
    type: String 
  },
  to:{
    type: String ,
  },
  tab:{
    type: String ,
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("CompanyAccount", CompanyAccountSchema);
