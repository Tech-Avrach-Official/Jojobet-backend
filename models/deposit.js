const mongoose = require("mongoose");
const depositConfigSchema = new mongoose.Schema({
  range80: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  range20: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  useFixedAmount: {
    type: Boolean,
    default: false
  },
  fixedAmount: {
    type: Number,
    required: function() {
      return this.useFixedAmount;
    }
  }
});

const DepositConfig = mongoose.model("DepositConfig", depositConfigSchema);

module.exports = DepositConfig;
