const mongoose = require("mongoose");

const CompanyAccountSchema = new mongoose.Schema({
  bankName: { 
    type: String, 
    required: true 
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
    enum: ["crypto", "Havale/EFT", "OnwinHavale/EFT","Kripto_Para","Parola_Para","Papara","Ultrapay_Havale","Finpay_Havale","Kolaypay_Papara","Havale[SN]"], 
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
